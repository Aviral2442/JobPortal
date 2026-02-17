const nodemailer = require("nodemailer");

const sendEmailOtp = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
    //   secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"NaukariJobAlert" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset OTP - NaukariJobAlert",
      html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px;">OTP Verification</h1>
                <p style="color: #7f8c8d; margin: 0 0 20px 0; font-size: 14px;">Password Reset Request</p>
                
                <p style="color: #34495e; margin: 0 0 20px 0; font-size: 16px;">Your One-Time Password for password reset is:</p>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 48px; letter-spacing: 8px; font-weight: bold;">${otp}</h2>
                </div>
                
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; border-radius: 4px; margin: 20px 0;">
                    <p style="color: #856404; margin: 0; font-size: 14px;"><b>⏱️ Valid for:</b> 5 minutes only</p>
                </div>
                
                <p style="color: #34495e; margin: 20px 0 0 0; font-size: 14px;">For security reasons, never share this OTP with anyone.</p>
                
                <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                
                <p style="color: #7f8c8d; margin: 0 0 10px 0; font-size: 13px;">If you didn't request this password reset, please ignore this email or <a href="mailto:support@naukari.com" style="color: #667eea; text-decoration: none;">contact support</a>.</p>
                
                <p style="color: #95a5a6; margin: 15px 0 0 0; font-size: 12px;">© 2024 NaukariJobAlert. All rights reserved.</p>
                </div>
            </div>
            `,
    };

    // ✅ Await email sending
    await transporter.verify();
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);

    return { success: false, error: error.message };
  }
};

module.exports = sendEmailOtp;
