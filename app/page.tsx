import Image from "next/image";
import Link from "next/link";
import Section from "../components/Section";
import { PRODUCTS } from "@/lib/products";

const trustItems = [
  ["Registered", "United States"],
  ["Operations", "UAE hub"],
  ["Focus", "Wholesale sourcing"],
  ["Ordering", "Email and WhatsApp"],
];

const process = [
  {
    title: "Share the need",
    text: "Category, quantity, destination.",
  },
  {
    title: "Confirm options",
    text: "Availability, packaging, case packs.",
  },
  {
    title: "Request order",
    text: "Choose SKUs and cartons.",
  },
  {
    title: "Coordinate next steps",
    text: "Pricing, logistics, documents.",
  },
];

const buyers = ["Retailers", "Wholesalers", "Supermarkets", "Convenience stores", "Trade partners"];
const featuredProducts = PRODUCTS.slice(0, 3);

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
            <div className="heroPoints" aria-label="Core services">
              <span>Retail-ready products</span>
              <span>UAE-focused operations</span>
              <span>Carton-based inquiries</span>
            </div>
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

      <Section title="Featured products">
        <div className="homeProductStrip">
          {featuredProducts.map((product) => (
            <article className="homeProductCard" key={product.sku}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} />
              <div>
                <div className="miniMetric">{product.category}</div>
                <h3>{product.name}</h3>
                <div className="miniLine">
                  {product.casePack ? `Case: ${product.casePack}` : `SKU: ${product.sku}`}
                </div>
              </div>
              <Link className="button secondary" href={`/order?sku=${encodeURIComponent(product.sku)}`}>
                Add
              </Link>
            </article>
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
              <ul className="scanList">
                <li>Shelf-ready items</li>
                <li>Clear packaging</li>
                <li>Wholesale case packs</li>
              </ul>
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
              <ul className="scanList">
                <li>Supplier coordination</li>
                <li>Shipment-ready details</li>
                <li>Fast follow-up</li>
              </ul>
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
              <div className="heroPoints compact" style={{ marginTop: 14 }}>
                <span>Snacks</span>
                <span>Confectionery</span>
                <span>Packaged foods</span>
              </div>
            </div>
          </article>

          <div className="categoryStack">
            <article className="categoryMini">
              <div className="miniMetric">Catalog clarity</div>
              <h3 className="cardTitle">Details buyers need</h3>
              <div className="miniLine">SKU. Origin. Case pack. MOQ.</div>
            </article>

            <article className="categoryMini">
              <div className="miniMetric">Request flow</div>
              <h3 className="cardTitle">Built around cartons</h3>
              <div className="miniLine">No checkout. Just a focused inquiry.</div>
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
              <ul className="homeList">
                <li>Convenience stores and kiosks</li>
                <li>Supermarkets and mixed displays</li>
                <li>SKU, origin, case pack, and MOQ visibility</li>
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
              <ul className="homeList">
                <li>Candy and variety boxes</li>
                <li>Seasonings and dry foods</li>
                <li>Availability confirmed after inquiry</li>
              </ul>
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
            <div className="heroPoints compact" style={{ marginTop: 12 }}>
              <span>Select products</span>
              <span>Add cartons</span>
              <span>Send request</span>
            </div>
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
