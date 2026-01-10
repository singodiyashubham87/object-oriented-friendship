import dayjs from "dayjs";
import nodemailer from "nodemailer";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const FROM_EMAIL =
  process.env.GMAIL_FROM_EMAIL || "singodiyashubham87@gmail.com";

export const sendPasswordResetEmail = async (email, resetToken) => {
  console.log("CHECKPOINT 1: Starting sendPasswordResetEmail");
  console.log(
    `CHECKPOINT 1.5: Config - ClientID: ${!!CLIENT_ID}, Secret: ${!!CLIENT_SECRET}, RefreshToken: ${!!REFRESH_TOKEN}`,
  );

  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      console.error(
        "Missing Gmail OAuth credentials. Please check GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN.",
      );
      throw new Error("Email service not configured properly");
    }

    console.log(
      "CHECKPOINT 2: Creating Nodemailer transporter with explicit settings (Port 587)",
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        type: "OAuth2",
        user: FROM_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
      },
    });

    console.log("CHECKPOINT 3: Transporter created. Preparing email options.");

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `Object Oriented Friendship <${FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your OOF Password",
      html: getEmailTemplate(resetUrl),
    };

    console.log("CHECKPOINT 4: Sending email...");

    const info = await transporter.sendMail(mailOptions);

    console.log("CHECKPOINT 5: Email sent successfully.", info.messageId);

    return { success: true };
  } catch (error) {
    console.error(
      "CHECKPOINT ERROR: Failed to send password reset email:",
      error,
    );
    return { success: false, error: error.message };
  }
};

function getEmailTemplate(resetUrl) {
  return `
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                          Hello,
                        </p>
                        <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password. Click the button below to create a new password:
                        </p>
                        
                        <!-- Reset Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="margin: 0 0 20px; color: #667eea; font-size: 14px; word-break: break-all;">
                          ${resetUrl}
                        </p>
                        
                        <p style="margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          © ${dayjs().format("YYYY")} Object-Oriented Friendship. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
  `;
}
