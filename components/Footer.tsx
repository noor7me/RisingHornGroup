import { CONTACT } from "@/lib/contact";

export default function Footer() {
  const { emails, whatsapp } = CONTACT;

  return (
    <footer className="footer">
      <div className="container footerInner">
        <div className="footerGrid">
          <div>
            <div className="footerTitle">RisingHorn Group</div>
            <p className="footerBlurb">
              Registered in the United States with operations in the UAE. Import, export, sourcing,
              and wholesale distribution support for food and consumer products.
            </p>
          </div>

          <div>
            <div className="footerTitle">Email</div>
            <p className="footerLine">
              Orders:{" "}
              <a className="footerLink" href={`mailto:${emails.orders}`}>
                {emails.orders}
              </a>
            </p>
            <p className="footerLine">
              Sales:{" "}
              <a className="footerLink" href={`mailto:${emails.sales}`}>
                {emails.sales}
              </a>
            </p>
            <p className="footerLine">
              General:{" "}
              <a className="footerLink" href={`mailto:${emails.info}`}>
                {emails.info}
              </a>
            </p>
          </div>

          <div>
            <div className="footerTitle">WhatsApp</div>
            <div className="footerWAList">
              {whatsapp.map((w) => (
                <a
                  key={w.e164}
                  className="footerWAItem"
                  href={`https://wa.me/${w.e164}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span aria-hidden>WA</span>
                  <span>{w.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="footerCopyright">
          Copyright {new Date().getFullYear()} RisingHorn Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
