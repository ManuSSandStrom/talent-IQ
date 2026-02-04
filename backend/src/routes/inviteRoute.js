import express from "express";
import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Create a reusable transporter (better performance)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS?.replace(/\s/g, ''), // Remove any spaces from password
      },
      // Optimized for cloud platforms
      pool: true,
      maxConnections: 1,
      maxMessages: 10,
      // Faster timeouts
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      // TLS settings
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
};

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

  // Send response immediately, email in background
  res.status(200).json({ 
    message: "Invitation is being sent. The recipient will receive it shortly." 
  });

  // Send email asynchronously (don't wait for it)
  try {
    console.log("📧 Email config - User:", ENV.EMAIL_USER);
    console.log("📧 Sending email to:", recipientEmail);
    
    const emailTransporter = getTransporter();
    const result = await emailTransporter.sendMail(mailOptions);
    
    console.log(`✅ Invite sent successfully to ${recipientEmail}`, result?.messageId);
  } catch (error) {
    console.error("❌ Error sending invite email:", error);
    // Email failed but response already sent - log for debugging
    // In production, you might want to implement a retry queue
  }
});

export default router;
