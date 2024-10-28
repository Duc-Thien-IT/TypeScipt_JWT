const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ducthien0912.dev@gmail.com",
        pass: "dimt dquc vrgj xrqe", 
    },
});

const sendOtpEmail = async (recipientEmail, otp) => {
    const mailOptions = {
        from: '"DUC THIEN" <ducthien0912.dev@gmail.com>', 
        to: recipientEmail,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

module.exports = { sendOtpEmail };
