require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sendEmail = require("./api/send-email");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve files from public folder

app.post("/send-email", async (req, res) => {
    try {
        const { name, email, phone, service, details } = req.body;
        console.log("Received Booking Request:", req.body);

        if (!name || !email || !service || !details) {
            console.error("Missing required fields!");
            return res.status(400).json({ message: "Missing required fields!" });
        }

        const emailResponse = await sendEmail({ name, email, phone, service, details });
        console.log("Email Sent Successfully!", emailResponse);

        res.status(200).json({ message: "Booking successful!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});