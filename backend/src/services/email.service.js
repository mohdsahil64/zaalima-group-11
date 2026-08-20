import nodemailer from 'nodemailer';
import config from '../config/index.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this._initialized = false;
  }

  _init() {
    if (this._initialized) return;
    this._initialized = true;

    const { host, port, user, password } = config.email;
    if (!host || !user || !password) {
      console.warn('[Email] SMTP not configured. Emails will be logged to console.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: port || 587,
      secure: port === 465,
      auth: { user, pass: password },
    });
  }

  isConfigured() {
    this._init();
    return !!this.transporter;
  }

  /**
   * Send an email. Falls back to console.log if SMTP not configured.
   */
  async send({ to, subject, html }) {
    this._init();

    const mailOptions = {
      from: `"${config.email.fromName || 'ATS'}" <${config.email.from || 'noreply@ats.com'}>`,
      to,
      subject,
      html,
    };

    if (!this.transporter) {
      console.log('[Email] (not sent - SMTP not configured)');
      console.log(`  To: ${to}`);
      console.log(`  Subject: ${subject}`);
      return { success: true, simulated: true };
    }

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('[Email] Send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // ─── NOTIFICATION TEMPLATES ────────────────────────────────────

  /**
   * Application received - notify recruiter
   */
  async notifyApplicationReceived({ recruiterEmail, recruiterName, applicantName, jobTitle }) {
    return this.send({
      to: recruiterEmail,
      subject: `New Application: ${applicantName} applied for ${jobTitle}`,
      html: this._template(`
        <h2>New Application Received</h2>
        <p>Hi ${recruiterName},</p>
        <p><strong>${applicantName}</strong> has applied for the position of <strong>${jobTitle}</strong>.</p>
        <p>Log in to your dashboard to review the application and AI analysis.</p>
        ${this._button('View Application', `${config.client.url}/recruiter/applications`)}
      `),
    });
  }

  /**
   * Application status changed - notify applicant
   */
  async notifyStatusChange({ applicantEmail, applicantName, jobTitle, companyName, newStatus }) {
    const statusMessages = {
      shortlisted: 'Your application has been shortlisted! The recruiter is interested in your profile.',
      interview: 'You have been selected for an interview. The recruiter will reach out with details.',
      offered: 'Congratulations! You have received a job offer.',
      rejected: 'Unfortunately, your application was not selected to move forward at this time.',
    };

    const message = statusMessages[newStatus] || `Your application status has been updated to: ${newStatus}`;

    return this.send({
      to: applicantEmail,
      subject: `Application Update: ${jobTitle} at ${companyName}`,
      html: this._template(`
        <h2>Application Status Update</h2>
        <p>Hi ${applicantName},</p>
        <p>${message}</p>
        <p><strong>Position:</strong> ${jobTitle}<br><strong>Company:</strong> ${companyName}<br><strong>Status:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
        ${this._button('View My Applications', `${config.client.url}/applicant/applications`)}
      `),
    });
  }

  /**
   * Interview scheduled - notify applicant
   */
  async notifyInterviewScheduled({ applicantEmail, applicantName, jobTitle, companyName, interviewDate }) {
    return this.send({
      to: applicantEmail,
      subject: `Interview Scheduled: ${jobTitle} at ${companyName}`,
      html: this._template(`
        <h2>Interview Scheduled</h2>
        <p>Hi ${applicantName},</p>
        <p>An interview has been scheduled for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(interviewDate).toLocaleString()}</p>
        <p>Please make sure to prepare and be available at the scheduled time.</p>
        ${this._button('View Details', `${config.client.url}/applicant/applications`)}
      `),
    });
  }

  /**
   * Company approved - notify recruiter
   */
  async notifyCompanyApproved({ recruiterEmail, recruiterName, companyName }) {
    return this.send({
      to: recruiterEmail,
      subject: `Company Approved: ${companyName}`,
      html: this._template(`
        <h2>Company Approved!</h2>
        <p>Hi ${recruiterName},</p>
        <p>Great news! Your company <strong>${companyName}</strong> has been approved on the ATS platform.</p>
        <p>You can now start posting jobs and receiving applications.</p>
        ${this._button('Post a Job', `${config.client.url}/recruiter/jobs/create`)}
      `),
    });
  }

  /**
   * Password reset - send reset link
   */
  async sendPasswordReset({ email, name, resetUrl }) {
    return this.send({
      to: email,
      subject: 'Password Reset Request',
      html: this._template(`
        <h2>Password Reset</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <p>This link expires in 10 minutes.</p>
        ${this._button('Reset Password', resetUrl)}
        <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      `),
    });
  }

  // ─── TEMPLATE HELPERS ──────────────────────────────────────────

  _button(text, url) {
    return `
      <table role="presentation" style="margin: 24px 0;">
        <tr>
          <td style="border-radius: 8px; background: #4F46E5; padding: 12px 24px;">
            <a href="${url}" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${text}</a>
          </td>
        </tr>
      </table>
    `;
  }

  _template(content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0F172A; font-family: 'Inter', Arial, sans-serif;">
        <table role="presentation" width="100%" style="padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 560px; background: #1E293B; border-radius: 12px; border: 1px solid #334155; padding: 40px;">
                <tr>
                  <td style="color: #F8FAFC; font-size: 14px; line-height: 1.6;">
                    ${content}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 30px; border-top: 1px solid #334155; margin-top: 30px;">
                    <p style="font-size: 12px; color: #94A3B8; margin: 0;">ATS - AI-Powered Applicant Tracking System</p>
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
}

export default new EmailService();
