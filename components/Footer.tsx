import { CONTACT } from "@/lib/contact";

export default function Footer() {
  const { emails, whatsapp } = CONTACT;

  return (
    <footer className="footer">
      <div className="container footerInner">
        <div className="footerGrid">
          <div>
            <div className="footerTitle">RisingHorn Group</div>
            <div className="p footerBlurb">
              Import • Export • Distribution for Somali & East African markets.
            </div>
          </div>

          <div>
            <div className="footerTitle">Email</div>

            <div className="p footerLine">
              <span className="footerLabel">General:</span>{" "}
              <a className="footerLink" href={`mailto:${emails.info}`}>
                {emails.info}
              </a>
            </div>

            <div className="p footerLine">
              <span className="footerLabel">Orders:</span>{" "}
              <a className="footerLink" href={`mailto:${emails.orders}`}>
                {emails.orders}
              </a>
            </div>

            <div className="p footerLine">
              <span className="footerLabel">Sales:</span>{" "}
              <a className="footerLink" href={`mailto:${emails.sales}`}>
                {emails.sales}
              </a>
            </div>
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
                  <span className="footerWAIcon" aria-hidden>
                    📱
                  </span>
                  <span className="footerWAText">{w.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="p footerCopyright">
          © {new Date().getFullYear()} RisingHorn Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
