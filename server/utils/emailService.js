const nodemailer = require("nodemailer");

/**
 * Creates a reusable nodemailer transporter based on environment variables.
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "SMTP configuration is incomplete. Please set SMTP_USER and SMTP_PASS in your .env file."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a real 6-digit OTP email for password reset via SMTP.
 * @param {string} toEmail - Recipient's email address
 * @param {string} otp - 6-digit one-time password
 * @param {string} username - Optional user name
 */
const sendPasswordResetOtpEmail = async (toEmail, otp, username = "there") => {
  const transporter = createTransporter();

  const appName = "Placement Coach";
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px 12px; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .badge { display: inline-flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: #4f46e5; margin-bottom: 20px; }
        .heading { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
        .text { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
        .otp-container { background: #f5f3ff; border: 2px dashed #c4b5fd; border-radius: 14px; padding: 20px; text-align: center; margin: 28px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: 'Courier New', Courier, monospace; margin: 0; }
        .expiry-note { font-size: 13px; color: #6b7280; margin-top: 10px; font-weight: 500; }
        .divider { border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">
          🎯 ${appName}
        </div>
        <h1 class="heading">Password Reset Verification Code</h1>
        <p class="text">Hello <strong>${username}</strong>,</p>
        <p class="text">We received a request to reset the password for your account associated with <strong>${toEmail}</strong>.</p>
        <p class="text">Please enter the 6-digit code below to verify your identity and set a new password:</p>
        
        <div class="otp-container">
          <div class="otp-code">${otp}</div>
          <div class="expiry-note">⏱️ Valid for 10 minutes</div>
        </div>
        
        <p class="text" style="font-size: 13px; color: #64748b;">
          🛡️ If you did not initiate this request, you can safely ignore this email. Your password will remain unchanged and your account is secure.
        </p>
        
        <div class="divider"></div>
        <div class="footer">
          This is an automated security email from ${appName}. Please do not reply directly to this email.<br>
          &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: `[${appName}] Your Password Reset Code is ${otp}`,
    text: `Hello ${username},\n\nYour password reset verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n— The ${appName} Team`,
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP Mailer] Successfully sent password reset OTP to: ${toEmail} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP Mailer] Error sending email to ${toEmail}:`, error.message);
    throw error;
  }
};

module.exports = { sendPasswordResetOtpEmail };
