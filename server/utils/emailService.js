/**
 * Sends a 6-digit OTP email for password reset via Brevo HTTP API.
 * Operates over port 443 (HTTPS), compatible with Render Free tier.
 */
const sendPasswordResetOtpEmail = async (toEmail, otp, username = "there") => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = "placementcoach.team@gmail.com";
  const appName = "Placement Coach";

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is missing from environment variables.");
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px 12px; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px 32px; }
        .badge { font-size: 18px; font-weight: 700; color: #4f46e5; margin-bottom: 20px; }
        .heading { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
        .text { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
        .otp-container { background: #f5f3ff; border: 2px dashed #c4b5fd; border-radius: 14px; padding: 20px; text-align: center; margin: 28px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: monospace; }
        .expiry-note { font-size: 13px; color: #6b7280; margin-top: 10px; }
        .divider { border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0; }
        .footer { font-size: 12px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">🎯 ${appName}</div>
        <h1 class="heading">Password Reset Verification Code</h1>
        <p class="text">Hello <strong>${username}</strong>,</p>
        <p class="text">We received a request to reset the password for your account associated with <strong>${toEmail}</strong>.</p>
        <div class="otp-container">
          <div class="otp-code">${otp}</div>
          <div class="expiry-note">⏱️ Valid for 10 minutes</div>
        </div>
        <p class="text" style="font-size: 13px; color: #64748b;">
          🛡️ If you did not initiate this request, you can safely ignore this email.
        </p>
        <div class="divider"></div>
        <div class="footer">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: appName, email: senderEmail },
        to: [{ email: toEmail, name: username }],
        subject: `[${appName}] Your Password Reset Code is ${otp}`,
        htmlContent: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Brevo API returned status ${response.status}`);
    }

    console.log(`[Brevo Mailer] Successfully sent OTP to ${toEmail} (MessageId: ${data.messageId})`);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error(`[Brevo Mailer] Error sending email to ${toEmail}:`, error.message);
    throw error;
  }
};

module.exports = { sendPasswordResetOtpEmail };