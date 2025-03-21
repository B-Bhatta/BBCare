const nodemailer = require("nodemailer");

const sendEmail = async ({ name, email, phone, service, details }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: "BBCare Team <bbhatta431@gmail.com>",
        to: email,
        cc: process.env.HOSPITAL_EMAIL,
        subject: `BBCare: Your ${service} Booking Confirmation`,
        text: `Dear ${name},\n\nThank you for booking a ${service} with BBCare.\n\nBooking Details:\n${details}\n\nBest regards,\nBBCare Team`,
        html: `<p>Dear ${name},</p><p>Thank you for booking a <strong>${service}</strong> with BBCare.</p><p><strong>Booking Details:</strong><br>${details.replace(/"/g, '').replace(/,/g, '<br>')}</p><p>Best regards,<br>BBCare Team</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent Successfully:", info.messageId);
    return info;
};

module.exports = sendEmail;