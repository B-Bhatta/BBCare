require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sendEmail = require("./send-email");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

app.post("/send-email", async (req, res) => {
    try {
        const { name, email, phone, service, details } = req.body;
        console.log("📩 Received Booking Request:", { name, email, phone, service, details });

        if (!name || !email || !service || !details) {
            console.error("❌ Missing required fields!");
            return res.status(400).json({ error: "Missing required fields" });
        }

        await sendEmail({ name, email, phone, service, details });
        console.log("✅ Email Sent Successfully!");

        res.status(200).json({ message: "Booking successful" });
    } catch (error) {
        console.error("❌ Error in /send-email:", error.message);
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); // Root to index.html
});

// 404 Fallback
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "index.html")); // Root to index.html
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});