import express from "express";
import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  console.log("📧 Invite route called");
  console.log("Request body:", req.body);
  
  const { recipientEmail, sessionId, hostName } = req.body;

  if (!recipientEmail || !sessionId) {
    return res.status(400).json({ message: "Recipient email and Session ID are required" });
  }

  if (!ENV.EMAIL_USER || !ENV.EMAIL_PASS) {
    return res.status(500).json({ 
      message: "Email configuration missing. Please add EMAIL_USER and EMAIL_PASS to backend .env file" 
    });
  }

  // Check if using placeholder/default credentials
  if (ENV.EMAIL_PASS === "abcd efgh ijkl mnop" || ENV.EMAIL_PASS === "your_app_password") {
    console.warn("⚠️  Email sending mocked: Using placeholder credentials. No real email sent.");
    return res.status(200).json({ message: "Invitation sent (Mock Mode)" });
  }

  try {
    // Use Gmail service with more reliable settings for cloud platforms
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail service shorthand
      host: "smtp.gmail.com",
      port: 465, // SSL port (more reliable on cloud platforms)
      secure: true, // Use SSL
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      connectionTimeout: 30000, // 30s connection timeout
      greetingTimeout: 30000, // 30s greeting timeout
      socketTimeout: 30000, // 30s socket timeout
      pool: true, // Use connection pooling
      maxConnections: 1,
      maxMessages: 3,
      rateDelta: 1000,
      rateLimit: 3
    });

    // Verify transporter configuration
    console.log("📧 Verifying email transporter...");
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    const sessionLink = `${ENV.CLIENT_URL}/session/${sessionId}`;

    const mailOptions = {
      from: `"Talent IQ" <${ENV.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Invitation: Technical Interview Session with ${hostName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; color: #333;">
          <h2 style="color: #2563eb; margin-top: 0; font-size: 24px;">Technical Interview Invitation</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6;"><strong>${hostName}</strong> has invited you to participate in a live technical interview session on the Talent IQ platform.</p>
          
          <div style="margin: 32px 0;">
            <a href="${sessionLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Join Interview Session</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">If the button above doesn't work, copy and paste this URL into your browser:</p>
          <p style="font-size: 14px; color: #2563eb; word-break: break-all;"><a href="${sessionLink}" style="color: #2563eb;">${sessionLink}</a></p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message from Talent IQ. Please do not reply to this email.</p>
        </div>
      `,
    };

    // Add a 45s timeout to prevent hanging
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Email sending timed out after 45 seconds")), 45000)
    );

    await Promise.race([sendPromise, timeoutPromise]);
    
    // Close the connection pool
    transporter.close();
    
    console.log(`✅ Invite sent successfully to ${recipientEmail}`);
    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("❌ Error sending invite email:", error);
    
    let errorMessage = "Failed to send invitation email.";
    if (error.message.includes("timed out") || error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
        errorMessage = "Email server connection timed out. The email service may be temporarily unavailable.";
    } else if (error.code === 'EAUTH' || error.message.includes('Invalid login')) {
        errorMessage = "Email authentication failed. Please check email credentials.";
    } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "Could not connect to email server. Please try again later.";
    } else if (error.message.includes('verify')) {
        errorMessage = "Email server verification failed. Please check email configuration.";
    }
      
    res.status(500).json({ message: errorMessage, error: error.message });
  }
});

export default router;
