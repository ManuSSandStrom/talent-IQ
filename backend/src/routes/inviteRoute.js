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
    from: `"AiHire" <${ENV.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Invitation: Technical Interview Session with ${hostName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; color: #333; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Stylish Gradient Header -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">AiHire</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px;">Code Together, Hire Better</p>
        </div>
        
        <div style="padding: 40px;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Technical Interview Invitation</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;"><strong>${hostName}</strong> has invited you to participate in a live technical interview session on the <strong>AiHire</strong> platform.</p>
          
          <div style="margin: 35px 0; text-align: center;">
            <a href="${sessionLink}" style="display: inline-block; background: linear-gradient(to right, #4f46e5, #7c3aed); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);">Join Interview Session</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">If the button above doesn't work, copy and paste this URL into your browser:</p>
          <p style="font-size: 14px; color: #4f46e5; word-break: break-all;"><a href="${sessionLink}" style="color: #4f46e5;">${sessionLink}</a></p>
          
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated message from AiHire. Please do not reply to this email.</p>
        </div>
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
