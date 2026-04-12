import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type ContactEmailPayload = {
  name: string;
  email: string;
  category?: string;
  message: string;
};

export async function sendContactEmail(payload: ContactEmailPayload) {
  const { name, email, category, message } = payload;
  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

  if (!toEmail || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[Email] SMTP not configured — skipping email delivery.");
    return false;
  }

  const categoryLine = category
    ? `<tr><td style="padding:8px 16px;color:#71717a;font-size:13px;vertical-align:top;">Category</td><td style="padding:8px 16px;font-size:14px;">${category}</td></tr>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
    
    <div style="background:#18181b;padding:28px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:600;letter-spacing:-0.02em;">
        New Inquiry — Rabin Son Photography
      </h1>
    </div>

    <div style="padding:28px 32px;">
      <p style="margin:0 0 20px;color:#52525b;font-size:14px;line-height:1.6;">
        You have a new contact form submission:
      </p>

      <table style="width:100%;border-collapse:collapse;border:1px solid #f4f4f5;border-radius:12px;overflow:hidden;">
        <tr style="background:#fafafa;">
          <td style="padding:8px 16px;color:#71717a;font-size:13px;vertical-align:top;width:100px;">Name</td>
          <td style="padding:8px 16px;font-size:14px;font-weight:500;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px;color:#71717a;font-size:13px;vertical-align:top;">Email</td>
          <td style="padding:8px 16px;font-size:14px;">
            <a href="mailto:${email}" style="color:#18181b;text-decoration:underline;">${email}</a>
          </td>
        </tr>
        ${categoryLine}
        <tr style="background:#fafafa;">
          <td style="padding:8px 16px;color:#71717a;font-size:13px;vertical-align:top;">Message</td>
          <td style="padding:8px 16px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</td>
        </tr>
      </table>

      <div style="margin-top:24px;">
        <a href="mailto:${email}?subject=Re: Your inquiry to Rabin Son Photography" 
           style="display:inline-block;background:#18181b;color:#ffffff;padding:10px 24px;border-radius:999px;font-size:13px;font-weight:500;text-decoration:none;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <div style="padding:16px 32px;background:#fafafa;border-top:1px solid #f4f4f5;">
      <p style="margin:0;color:#a1a1aa;font-size:11px;">
        Sent from your portfolio contact form at rabinson.com
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Rabin Son Photography" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Inquiry from ${name}${category ? ` — ${category}` : ""}`,
      html,
    });
    console.log(`[Email] Contact notification sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}
