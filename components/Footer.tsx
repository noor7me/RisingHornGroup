import { CONTACT } from "@/lib/contact";

function WhatsAppIcon() {
  return <span aria-hidden style={{ marginRight: 8 }}>📱</span>;
}

export default function Footer() {
  const { emails, whatsapp } = CONTACT;
  return (
    <footer className="footer">
      <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>RisingHorn Group</div>
            <div className="p" style={{ margin: 0 }}>Import • Export • Distribution for Somali & East African markets.</div>
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Email</div>
            <div className="p" style={{ margin: 0 }}>
              General: <a className="underline" href={`mailto:${emails.info}`}>{emails.info}</a>
            </div>
            <div className="p" style={{ margin: 0 }}>
              Orders: <a className="underline" href={`mailto:${emails.orders}`}>{emails.orders}</a>
            </div>
            <div className="p" style={{ margin: 0 }}>
              Sales: <a className="underline" href={`mailto:${emails.sales}`}>{emails.sales}</a>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>WhatsApp</div>
            {whatsapp.map((w) => (
              <div key={w.e164} className="p" style={{ margin: 0 }}>
                <a
                  className="underline"
                  href={`https://wa.me/${w.e164}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon />{w.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="p" style={{ marginTop: 14, fontSize: 12 }}>
          © {new Date().getFullYear()} RisingHorn Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
