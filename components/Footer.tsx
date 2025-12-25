import { CONTACT } from "@/lib/contact";

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: 8 }}>
      <path
        fill="currentColor"
        d="M20 3H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
      />
    </svg>
  );
}

export default function Footer() {
  const { emails, whatsapp } = CONTACT;

  return (
    <footer className="border-t mt-12 py-10 text-sm text-green-800">
      <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-semibold mb-2">RisingHorn Group</div>
          <div className="text-green-700">
            Import • Export • Distribution for Somali & East African markets.
          </div>
        </div>

        <div>
          <div className="font-semibold mb-2">Email</div>
          <ul className="space-y-1">
            <li>
              General:{" "}
              <a className="underline" href={`mailto:${emails.info}`}>
                {emails.info}
              </a>
            </li>
            <li>
              Orders:{" "}
              <a className="underline" href={`mailto:${emails.orders}`}>
                {emails.orders}
              </a>
            </li>
            <li>
              Sales:{" "}
              <a className="underline" href={`mailto:${emails.sales}`}>
                {emails.sales}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">WhatsApp</div>
          <ul className="space-y-1">
            {whatsapp.map((w) => (
              <li key={w.e164}>
                <a
                  className="inline-flex items-center underline"
                  href={`https://wa.me/${w.e164}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WhatsApp ${w.label}`}
                >
                  <WhatsAppIcon />
                  {w.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 text-green-700">
        © {new Date().getFullYear()} RisingHorn Group. All rights reserved.
      </div>
    </footer>
  );
}
