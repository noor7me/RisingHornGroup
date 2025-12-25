import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT } from "@/lib/contact";

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  inquiryType?: "general" | "orders" | "sales";
  attachmentName?: string;
  attachmentBase64?: string; // base64 (no data: prefix)
};

function pickRecipient(inquiryType: Payload["inquiryType"]) {
  switch (inquiryType) {
    case "orders":
      return CONTACT.emails.orders;
    case "sales":
      return CONTACT.emails.sales;
    case "general":
    default:
      return CONTACT.emails.info;
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM; // e.g. "RisingHorn Website <[email protected]>"
    if (!apiKey) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }
    if (!from) {
      return NextResponse.json({ error: "Missing RESEND_FROM" }, { status: 500 });
    }

    const body = (await req.json()) as Payload;

    const name = (body.name || "").trim();
    const company = (body.company || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const message = (body.message || "").trim();
    const inquiryType = body.inquiryType || "general";

    if (!message || message.length < 5) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    // basic sanity limits
    if (name.length > 120 || company.length > 160 || email.length > 200 || phone.length > 60 || message.length > 8000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const attachmentName = (body.attachmentName || "").trim();
    const attachmentBase64 = (body.attachmentBase64 || "").trim();
    let attachments:
      | Array<{ filename: string; content: Buffer; contentType?: string }>
      | undefined;

    if (attachmentBase64) {
      // Hard safety limit: ~2MB base64 (~1.5MB binary)
      if (attachmentBase64.length > 3_000_000) {
        return NextResponse.json({ error: "Attachment too large." }, { status: 400 });
      }
      try {
        const buf = Buffer.from(attachmentBase64, "base64");
        attachments = [
          {
            filename: attachmentName || "attachment.pdf",
            content: buf,
            contentType: "application/pdf",
          },
        ];
      } catch {
        return NextResponse.json({ error: "Invalid attachment." }, { status: 400 });
      }
    }

    const to = pickRecipient(inquiryType);

    const resend = new Resend(apiKey);

    const subjectPrefix =
      inquiryType === "orders" ? "Order Inquiry" : inquiryType === "sales" ? "Supplier/Partnership Inquiry" : "Website Contact";

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;line-height:1.4">
        <h2>${subjectPrefix}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name || "(not provided)")}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "(not provided)")}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "(not provided)")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "(not provided)")}</p>
        <p><strong>Inquiry Type:</strong> ${escapeHtml(inquiryType)}</p>
        <hr/>
        <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `${subjectPrefix} — RisingHorn.com`,
      replyTo: email || undefined,
      html,
      attachments,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
