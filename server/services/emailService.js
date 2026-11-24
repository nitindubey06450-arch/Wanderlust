const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    this.port = parseInt(process.env.EMAIL_PORT) || 587;
    this.user = process.env.EMAIL_USER;
    this.pass = process.env.EMAIL_PASSWORD;
    this.from = process.env.EMAIL_FROM || '"Wanderlust Explorer" <noreply@wanderlust.com>';
  }

  getTransporter() {
    if (!this.user || !this.pass) {
      return null;
    }

    return nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.port === 465, // true for 465, false for 587
      auth: {
        user: this.user,
        pass: this.pass
      }
    });
  }

  /**
   * Send 6-digit OTP verification email
   */
  async sendOTPEmail(email, otp) {
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #f1f5f9;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Wanderlust</h1>
          <p style="color: #d1fae5; margin: 4px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Discover places. Create memories.</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px; text-align: center; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 700;">Wanderlust Email Verification</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
            Thank you for starting your journey with Wanderlust! Please use the following 6-digit verification code to complete your registration:
          </p>
          
          <!-- OTP Display Box -->
          <div style="background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 16px; padding: 20px; margin: 0 auto 28px auto; max-width: 280px;">
            <span style="font-size: 36px; font-weight: 800; color: #047857; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          </div>

          <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">
            ⏳ Your verification code is valid for <strong>10 minutes</strong>.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            If you did not request this email, please ignore it or contact support.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Wanderlust Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    const transporter = this.getTransporter();

    if (!transporter) {
      console.log('--------------------------------------------------');
      console.log(`[DEV MODE OTP] Email: ${email} | OTP: ${otp}`);
      console.log('To send real emails, set EMAIL_USER & EMAIL_PASSWORD in server/.env');
      console.log('--------------------------------------------------');
      return true;
    }

    try {
      await transporter.sendMail({
        from: this.from,
        to: email,
        subject: 'Wanderlust Email Verification Code',
        html: htmlTemplate
      });
      return true;
    } catch (error) {
      console.error('Nodemailer Error:', error.message);
      // Even if Nodemailer fails in dev, log OTP in console so testing is never blocked
      console.log(`[FALLBACK DEV OTP] Email: ${email} | OTP: ${otp}`);
      return false;
    }
  }
}

module.exports = new EmailService();
