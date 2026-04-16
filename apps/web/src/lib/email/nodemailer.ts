import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
    ? `<tr><td style="padding:10px 16px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;">Category</td><td style="padding:10px 16px;font-size:14px;color:#18181b;">${category}</td></tr>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
    <div style="background:#000000;padding:32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">RabinSon</h1>
    </div>
    <div style="padding:40px 48px;">
      <p style="margin:0 0 24px;color:#52525b;font-size:14px;line-height:1.6;">You have received a new inquiry from the portfolio contact form:</p>
      
      <table style="width:100%;border-collapse:separate;border-spacing:0;background:#f8fafc;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:16px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;width:100px;">Sender</td>
          <td style="padding:16px;font-size:14px;color:#18181b;font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;">Email</td>
          <td style="padding:10px 16px;font-size:14px;">
            <a href="mailto:${email}" style="color:#000000;text-decoration:none;border-bottom:1px solid #e5e5e5;">${email}</a>
          </td>
        </tr>
        ${categoryLine}
        <tr>
          <td style="padding:16px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;">Inquiry</td>
          <td style="padding:16px;font-size:14px;color:#18181b;line-height:1.7;white-space:pre-wrap;">${message}</td>
        </tr>
      </table>

      <div style="margin-top:40px;">
        <a href="mailto:${email}?subject=Response to your inquiry at RabinSon" 
           style="display:inline-block;background:#000000;color:#ffffff;padding:14px 32px;border-radius:99px;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.05em;">
          Reply to Inquiry
        </a>
      </div>
    </div>
    <div style="padding:24px 48px;background:#f8fafc;border-top:1px solid #e5e5e5;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:11px;letter-spacing:0.02em;">Managed via RabinSon Editorial Client</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const info = await transporter.sendMail({
      from: `"RabinSon Notifications" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Inquiry: ${name}${category ? ` — ${category}` : ""}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

export async function sendClientConfirmation(payload: ContactEmailPayload) {
  const { name, email } = payload;
  const fromEmail = process.env.SMTP_USER;

  if (!fromEmail) return { success: false, error: "Missing SMTP_USER in process.env" };
  if (!email) return { success: false, error: "Missing recipient email in payload" };
  if (!process.env.SMTP_PASS) return { success: false, error: "Missing SMTP_PASS in process.env" };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
    <div style="background:#000000;padding:32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">RabinSon</h1>
    </div>
    <div style="padding:40px 48px;">
      <h2 style="margin:0 0 16px;color:#18181b;font-size:22px;font-weight:700;">A quick note of appreciation.</h2>
      <p style="margin:0 0 24px;color:#52525b;font-size:15px;line-height:1.7;">
        Hi ${name.split(' ')[0]}, thank you for reaching out and sharing your vision with RabinSon. We truly appreciate the opportunity to potentially collaborate on something timeless with you.
      </p>
      <p style="margin:0 0 24px;color:#52525b;font-size:15px;line-height:1.7;">
        Your inquiry is currently being reviewed with the care it deserves. We will get back to you with availability and a tailored proposal within <b>24 to 48 hours</b>.
      </p>
      <p style="margin:40px 0 0;color:#18181b;font-size:14px;font-weight:600;">With gratitude,</p>
      <p style="margin:4px 0 0;color:#71717a;font-size:14px;">RabinSon Photography</p>
    </div>
    <div style="padding:24px 48px;background:#f8fafc;border-top:1px solid #e5e5e5;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:11px;letter-spacing:0.02em;">Honest Light. Timeless Detail. Available Worldwide.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const info = await transporter.sendMail({
      from: `"RabinSon" <${fromEmail}>`,
      to: email,
      subject: `Thank you for reaching out — RabinSon`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}
