import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const fullName = (body.fullName ?? "").trim();
    const email = (body.email ?? "").trim();
    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();
    const escapedFullName = escapeHtml(fullName);
    const escapedEmail = escapeHtml(email);
    const escapedSubject = escapeHtml(subject);
    const escapedMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const toAddress = process.env.CONTACT_TO ?? "contact@lascofed.com";
    const fromAddress = process.env.CONTACT_FROM ?? smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass || !fromAddress) {
      return NextResponse.json(
        { error: "Contact form email is not configured on the server." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `[LASCOFED Contact] ${subject}`,
      text: `New contact form submission\n\nName: ${fullName}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="margin:0;padding:24px;background:#070b14;font-family:Arial,sans-serif;color:#0f172a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;background:linear-gradient(135deg,#065f46,#0f766e);color:#ffffff;">
                <p style="margin:0;font-size:12px;letter-spacing:0.08em;opacity:0.9;text-transform:uppercase;">LASCOFED</p>
                <h2 style="margin:8px 0 0;font-size:24px;line-height:1.3;">New Contact Form Submission</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:14px;color:#475569;">A visitor submitted the contact form on the website.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;width:32%;">Full Name</td>
                    <td style="padding:14px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapedFullName}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">Email</td>
                    <td style="padding:14px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapedEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">Subject</td>
                    <td style="padding:14px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapedSubject}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;font-weight:700;color:#334155;vertical-align:top;">Message</td>
                    <td style="padding:14px 16px;font-size:14px;color:#0f172a;line-height:1.5;">${escapedMessage}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#64748b;">Sent automatically from the LASCOFED website contact form.</p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const details = error instanceof Error ? error.message : "Unknown error";

      return NextResponse.json(
        { error: "Unable to send message right now.", details },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}
