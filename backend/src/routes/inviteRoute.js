import express from "express";
import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
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
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Upgrade later with STARTTLS
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
      // Force IPv4 and add implementation-level timeouts
      tls: {
          rejectUnauthorized: false
      },
      family: 4, // Force IPv4
      connectionTimeout: 10000, // 10s connection timeout
      socketTimeout: 10000 // 10s socket timeout
    });

    const sessionLink = `${ENV.CLIENT_URL}/session/${sessionId}`;

    const mailOptions = {
      from: ENV.EMAIL_USER,
      to: recipientEmail,
      subject: `Invite to Interview Session from ${hostName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">Technical Interview Invitation</h2>
          <p>Hello,</p>
          <p><strong>${hostName}</strong> has invited you to join a technical interview session.</p>
          <p>Please click the button below to join:</p>
          <a href="${sessionLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Join Session</a>
          <p style="margin-top: 20px; color: #666;">Or copy this link: <a href="${sessionLink}">${sessionLink}</a></p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">Talent IQ Platform</p>
        </div>
      `,
    };

    // Add a 15s timeout to prevent hanging (slightly longer than connection timeout)
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Email sending timed out after 15 seconds")), 15000)
    );

    await Promise.race([sendPromise, timeoutPromise]);
    
    console.log(`Invite sent successfully to ${recipientEmail}`);
    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error sending invite email:", error);
    
    let errorMessage = "Failed to send invitation email.";
    if (error.message.includes("timed out") || error.code === 'ETIMEDOUT') {
        errorMessage = "Email server connection timed out. Please try again.";
    } else if (error.code === 'EAUTH') {
        errorMessage = "Email authentication failed. Check credentials.";
    }
      
    res.status(500).json({ message: errorMessage, error: error.message });
  }
});

export default router;
