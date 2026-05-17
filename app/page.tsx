import Image from "next/image";
import Link from "next/link";
import Section from "../components/Section";

const trustItems = [
  ["Registered", "United States"],
  ["Operations", "UAE hub"],
  ["Focus", "Wholesale sourcing"],
  ["Ordering", "Email and WhatsApp"],
];

const process = [
  {
    title: "Share the need",
    text: "Tell us the product category, target quantity, destination, and timing.",
  },
  {
    title: "Confirm options",
    text: "We align availability, packaging, case packs, and supplier details.",
  },
  {
    title: "Request order",
    text: "Build a simple carton-based request from the live catalog or by message.",
  },
  {
    title: "Coordinate next steps",
    text: "We follow up on pricing, logistics, and documentation requirements.",
  },
];

const buyers = ["Retailers", "Wholesalers", "Supermarkets", "Convenience stores", "Trade partners"];

export default function HomePage() {
  return (
    <>
      <section className="homeHero">
        <div className="homeHeroShell">
          <div className="homeHeroMedia">
            <Image
              src="/home/warehouse-pallets.png"
              alt="Warehouse pallets ready for import and distribution"
              fill
              priority
              className="homeHeroImg"
            />
          </div>

          <div className="homeHeroContent">
            <div className="homeKicker">RisingHorn Group</div>
            <h1 className="homeTitle">Wholesale sourcing for imported food and consumer products.</h1>
            <p className="homeSub">
              We help retailers, wholesalers, and trade partners source fast-moving products through
              a UAE-focused distribution hub backed by practical import and export support.
            </p>
            <div className="homeCtas" style={{ marginTop: 24 }}>
              <Link className="button" href="/products">
                Browse Products
              </Link>
              <Link className="button secondary" href="/order">
                Request an Order
              </Link>
              <Link className="button ghost" href="/contact">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        <div className="homeTrustBar">
          {trustItems.map(([label, value]) => (
            <div className="homeTrustItem" key={label}>
              <div className="homeTrustLabel">{label}</div>
              <div className="homeTrustValue">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Who we support">
        <div className="buyerGrid">
          {buyers.map((buyer) => (
            <div className="buyerChip" key={buyer}>
              {buyer}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Built for practical trade work"
        subtitle="Clear product details, flexible carton quantities, and responsive follow-up for buyers who need decisions without friction."
      >
        <div className="grid2">
          <article className="card homeImageCard">
            <div className="homeCardMedia">
              <Image
                src="/home/sourcing-spices.png"
                alt="Sourcing packaged food products"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="cardTitle">Sourcing and product fit</h3>
              <p className="muted">
                We focus on shelf-ready items with clear packaging, dependable case packs, and demand
                potential for retail and wholesale channels.
              </p>
            </div>
          </article>

          <article className="card homeImageCard">
            <div className="homeCardMedia">
              <Image
                src="/home/hero-distribution-trucks.png"
                alt="Distribution trucks prepared for delivery"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="cardTitle">Import and distribution support</h3>
              <p className="muted">
                From supplier coordination to shipment-ready documentation, we keep order requests
                organized so customers can move quickly.
              </p>
            </div>
          </article>
        </div>
      </Section>

      <div className="softBand">
        <Section
          title="How requests move"
          subtitle="A simple process for early availability checks, wholesale inquiries, and repeat order discussions."
        >
          <div className="processGrid">
            {process.map((item) => (
              <article className="card processCard" key={item.title}>
                <h3 className="cardTitle">{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Product focus">
        <div className="categoryMosaic">
          <article className="categoryPanel">
            <Image
              src="/home/global-products.png"
              alt="Assorted retail products"
              fill
              className="categoryPanelImg"
            />
            <div>
              <p className="miniMetric">High-demand categories</p>
              <h3 className="cardTitle" style={{ color: "#fff", fontSize: 28 }}>
                Shelf-ready products for fast retail movement
              </h3>
              <p className="muted" style={{ color: "rgba(255,255,255,.78)" }}>
                Snacks, confectionery, seasonings, packaged foods, beverages, and selected consumer
                essentials for wholesale sourcing.
              </p>
            </div>
          </article>

          <div className="categoryStack">
            <article className="categoryMini">
              <div className="miniMetric">Catalog clarity</div>
              <h3 className="cardTitle">Details buyers need</h3>
              <p className="muted">
                SKU, origin, size, case pack, MOQ, and product notes stay close to the request action.
              </p>
            </article>

            <article className="categoryMini">
              <div className="miniMetric">Request flow</div>
              <h3 className="cardTitle">Built around cartons</h3>
              <p className="muted">
                Buyers can build a focused inquiry without a full ecommerce checkout.
              </p>
            </article>
          </div>
        </div>
      </Section>

      <Section title="Featured categories">
        <div className="grid2">
          <article className="card homeImageCard">
            <div className="homeCardMedia">
              <Image
                src="/home/global-products.png"
                alt="Assorted retail products"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="cardTitle">Snacks and impulse items</h3>
              <p className="muted">
                Fast-moving products for convenience stores, kiosks, supermarkets, and mixed retail
                displays.
              </p>
              <ul className="homeList">
                <li>SKU, origin, case pack, and MOQ visibility</li>
                <li>Catalog browsing with simple order request actions</li>
                <li>Follow-up by email or WhatsApp</li>
              </ul>
            </div>
          </article>

          <article className="card homeImageCard">
            <div className="homeCardMedia">
              <Image
                src="/home/assorted-snacks.png"
                alt="Assorted snacks and confectionery"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="cardTitle">Confectionery and packaged foods</h3>
              <p className="muted">
                Candy, variety boxes, seasonings, dry food items, and other high-demand products
                suited for wholesale sourcing.
              </p>
              <div className="ctaRow">
                <Link className="button" href="/products">
                  See Catalog
                </Link>
                <Link className="button secondary" href="/contact">
                  Ask Availability
                </Link>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Section title="Ready to start?">
        <div className="homeCtaCard">
          <div>
            <h3 className="cardTitle" style={{ color: "#fff" }}>
              Send a focused order request
            </h3>
            <p className="muted">
              Select products, choose carton quantities, and submit. We will follow up with
              availability, pricing, and delivery options.
            </p>
          </div>
          <div className="homeCtas">
            <Link className="button" href="/order">
              Build Request
            </Link>
            <Link className="button secondary" href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
