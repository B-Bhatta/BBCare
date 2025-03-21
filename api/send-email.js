require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, email, phone, service, details } = req.body;
        console.log("📩 Received Booking Request:", { name, email, phone, service, details });

        if (!name || !email || !service || !details) {
            console.error("❌ Missing required fields!");
            return res.status(400).json({ error: "Missing required fields" });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // For debugging, can be removed in production
            }
        });

        const mailOptions = {
            from: `"BBCare Team" <${process.env.EMAIL_USER}>`,
            to: email,
            cc: process.env.EMAIL_USER, // Send a copy to BBCare
            subject: `BBCare: Your ${service} Booking Confirmation`,
            text: `Dear ${name},\n\nThank you for booking a ${service} with BBCare.\n\nBooking Details:\n${details}\n\nBest regards,\nBBCare Team`,
            html: `<p>Dear ${name},</p><p>Thank you for booking a <strong>${service}</strong> with BBCare.</p><p><strong>Booking Details:</strong><br>${details.replace(/"/g, '').replace(/,/g, '<br>')}</p><p>Best regards,<br>BBCare Team</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent Successfully:", info.messageId, "Response:", info.response);

        res.status(200).json({ message: "Booking successful" });
    } catch (error) {
        console.error("❌ Error in /send-email:", error.message, "Code:", error.code);
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
};
