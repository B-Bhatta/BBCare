const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Get form data from the request
        const { name, email, phone, service, details } = req.body;
        console.log("📩 Received Form Data:", { name, email, phone, service, details });

        // Check for required fields
        if (!name || !email || !service || !details) {
            console.error("❌ Missing required fields!");
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Set up Nodemailer with Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail from .env
                pass: process.env.EMAIL_PASS, // App Password from .env
            },
        });

        // Verify SMTP connection
        await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.error("❌ SMTP Connection Error:", error);
                    reject(error);
                } else {
                    console.log("✅ SMTP Connection Successful");
                    resolve(success);
                }
            });
        });

        // Email content
        const mailOptions = {
            from: {
                name: "BBCare Team",
                address: process.env.EMAIL_USER,
            },
            to: email, // Send to the user
            cc: process.env.EMAIL_USER, // CC yourself
            subject: `BBCare: Your ${service} Booking Confirmation`,
            text: `Dear ${name},\n\nThank you for booking a ${service} with BBCare.\n\nBooking Details:\n${details}\n\nBest regards,\nBBCare Team`,
            html: `<p>Dear ${name},</p><p>Thank you for booking a <strong>${service}</strong> with BBCare.</p><p><strong>Booking Details:</strong><br>${details.replace(/"/g, "").replace(/,/g, "<br>")}</p><p>Best regards,<br>BBCare Team</p>`,
        };

        // Send the email
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("❌ Email Sending Error:", err);
                    reject(err);
                } else {
                    console.log("✅ Email Sent Successfully:", info.messageId, "Response:", info.response);
                    resolve(info);
                }
            });
        });

        // Success response
        res.status(200).json({ message: "Booking successful" });
    } catch (error) {
        console.error("❌ Error in /send-email:", error.message);
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
};
