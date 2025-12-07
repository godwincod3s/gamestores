// lib/emailTemplates.ts
export const emailTemplates = {
  // Verification email (sent on signup by WordPress automatically)
  verification: (verifyLink: string, displayName: string) => ({
    subject: "Verify Your GameStores Account",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to GameStores, ${displayName}!</h2>
          <p>Click the link below to verify your email address:</p>
          <p>
            <a href="${verifyLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>Or copy this link: <code>${verifyLink}</code></p>
          <p>This link expires in 24 hours.</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            © 2025 GameStores. All rights reserved.
          </p>
        </body>
      </html>
    `,
    text: `Welcome to GameStores!\n\nVerify your email by visiting: ${verifyLink}\n\nThis link expires in 24 hours.`,
  }),

  // 2FA OTP email
  twoFactorCode: (code: string, displayName: string) => ({
    subject: "Your GameStores 2FA Code",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Two-Factor Authentication</h2>
          <p>Hi ${displayName},</p>
          <p>Your 2FA verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px;">
            ${code}
          </p>
          <p style="color: #666;">This code expires in 10 minutes.</p>
          <p style="color: #cc0000; font-size: 12px;">
            <strong>Never share this code with anyone.</strong>
          </p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            © 2025 GameStores. All rights reserved.
          </p>
        </body>
      </html>
    `,
    text: `Your 2FA code is: ${code}\n\nExpires in 10 minutes.\n\nNever share this code.`,
  }),

  // Password reset email
  passwordReset: (resetLink: string, displayName: string) => ({
    subject: "Reset Your GameStores Password",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hi ${displayName},</p>
          <p>Click the link below to reset your password:</p>
          <p>
            <a href="${resetLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>Or copy this link: <code>${resetLink}</code></p>
          <p style="color: #666; font-size: 12px;">
            This link expires in 1 hour. If you didn't request this, ignore this email.
          </p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            © 2025 GameStores. All rights reserved.
          </p>
        </body>
      </html>
    `,
    text: `Reset your password: ${resetLink}\n\nExpires in 1 hour.`,
  }),

  // Welcome after signup
  welcome: (displayName: string, accountLink: string) => ({
    subject: "Welcome to GameStores!",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to GameStores, ${displayName}!</h2>
          <p>Your account has been created successfully.</p>
          <p>
            <a href="${accountLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Your Account
            </a>
          </p>
          <h3>Next Steps:</h3>
          <ul>
            <li>Complete your profile</li>
            <li>Add a payment method</li>
            <li>Enable 2FA for extra security</li>
          </ul>
          <hr />
          <p style="color: #666; font-size: 12px;">
            © 2025 GameStores. All rights reserved.
          </p>
        </body>
      </html>
    `,
    text: `Welcome to GameStores!\n\nGo to your account: ${accountLink}\n\nEnable 2FA for security.`,
  }),
};