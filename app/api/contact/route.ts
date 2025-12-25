import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT } from "@/lib/contact";
import PDFDocument from "pdfkit";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  inquiryType?: "general" | "orders" | "sales";
  includePdf?: boolean;
  order?: {
    totalCartons?: number;
    notes?: string;
    items?: Array<{
      sku: string;
      name: string;
      qtyCartons: number;
      size?: string;
      casePack?: string;
      moq?: string;
      origin?: string;
    }>;
  };
};

async function buildOrderPdf(body: Payload): Promise<Buffer> {
  const doc = new PDFDocument({ size: "LETTER", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));

  doc.fontSize(18).text("RisingHorn Group — Order Request", { underline: false });
  doc.moveDown(0.8);

  doc.fontSize(11);
  doc.text(`Name: ${body.name || ""}`);
  if (body.company) doc.text(`Company: ${body.company}`);
  doc.text(`Phone: ${body.phone || ""}`);
  if (body.email) doc.text(`Email: ${body.email}`);
  doc.moveDown(0.8);

  doc.fontSize(13).text("Items", { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(11);

  const items = body.order?.items ?? [];
  for (const it of items) {
    doc.font("Helvetica-Bold").text(`${it.name} (${it.sku})`);
    doc.font("Helvetica").text(`Qty: ${it.qtyCartons} cartons`);
    if (it.size) doc.text(`Size: ${it.size}`);
    if (it.casePack) doc.text(`Case: ${it.casePack}`);
    if (it.moq) doc.text(`MOQ: ${it.moq}`);
    if (it.origin) doc.text(`Origin: ${it.origin}`);
    doc.moveDown(0.5);
  }

  if (typeof body.order?.totalCartons === "number") {
    doc.moveDown(0.4);
    doc.font("Helvetica-Bold").text(`Carton total: ${body.order.totalCartons}`);
    doc.font("Helvetica");
  }

  if (body.order?.notes) {
    doc.moveDown(0.8);
    doc.fontSize(13).text("Notes", { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(11).text(body.order.notes);
  }

  doc.moveDown(1.0);
  doc.fontSize(9).fillColor("#555").text(`Generated: ${new Date().toISOString()}`);
  doc.end();

  await new Promise<void>((resolve) => doc.on("end", () => resolve()));
  return Buffer.concat(chunks);
}

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
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const company = (body.company || "").trim();
    const message = (body.message || "").trim();
    const inquiryType = body.inquiryType || "general";

    if (!message || message.length < 5) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    // basic sanity limits
    if (name.length > 120 || email.length > 200 || phone.length > 60 || company.length > 200 || message.length > 8000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
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

    let attachments:
      | {
          filename: string;
          content: string;
          contentType: string;
        }[]
      | undefined = undefined;

    if (body.includePdf && inquiryType === "orders" && (body.order?.items?.length || 0) > 0) {
      const pdf = await buildOrderPdf({ ...body, name, email, phone, company, message });
      attachments = [
        {
          filename: `RisingHorn_Order_${new Date().toISOString().slice(0, 10)}.pdf`,
          content: pdf.toString("base64"),
          contentType: "application/pdf",
        },
      ];
    }

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
