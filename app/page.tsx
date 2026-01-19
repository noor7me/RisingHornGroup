import Image from "next/image";
import Link from "next/link";
import Section from "../components/Section";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <div className="homeHero">
        <div className="homeHeroInner container">
          <div className="homeHeroCard">
            <div className="homeHeroMedia">
              <Image
                src="/home/warehouse-pallets.png"
                alt="Import • Export • Distribution (warehouse operations)"
                fill
                priority
                className="homeHeroImg"
              />
            </div>

            <div className="homeHeroContent">
              <div className="homeKicker">Rising Horn Group</div>
              <h1 className="homeTitle">Import • Export • Distribution</h1>
              <p className="homeSub">
                We connect reliable international suppliers through our UAE hub and across East African markets —
                helping retailers and wholesalers source fast-moving products, with clear packaging and
                dependable logistics.
              </p>

              <div className="homeCtas">
                <Link className="button" href="/products">Browse Products</Link>
                <Link className="button secondary" href="/order">Request an Order</Link>
              </div>

              <div className="homeStats">
                <div className="homeStat">
                  <div className="homeStatNum">Global</div>
                  <div className="homeStatLabel">Supplier sourcing</div>
                </div>
                <div className="homeStat">
                  <div className="homeStatNum">Flexible</div>
                  <div className="homeStatLabel">Carton quantities</div>
                </div>
                <div className="homeStat">
                  <div className="homeStatNum">Simple</div>
                  <div className="homeStatLabel">Email / WhatsApp ordering</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT WE DO */}
      <Section title="What we do">
        <div className="homeGrid2">
          <div className="homeCard">
            <div className="homeCardMedia">
              <Image
                src="/home/sourcing-spices.png"
                alt="Sourcing quality food products and spices"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="homeH3">Sourcing & quality</h3>
              <p className="muted">
                We focus on high-demand products with strong shelf appeal. We work with exporters to
                ensure consistent packaging, clear labeling, and shipment-ready case packs.
              </p>
            </div>
          </div>

          <div className="homeCard">
            <div className="homeCardMedia">
              <Image
                src="/home/hero-distribution-trucks.png"
                alt="Distribution-ready logistics (trucks)"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="homeH3">Distribution-ready logistics</h3>
              <p className="muted">
                From pickup and consolidation to last-mile delivery, we help align timelines and
                documentation for smoother importing and local distribution.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* PRODUCT FOCUS */}
      <Section title="Popular product focus">
        <div className="homeGrid2">
          <div className="homeCard homeCardTall">
            <div className="homeCardMedia">
              <Image
                src="/home/global-products.png"
                alt="Assorted products for retail"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="homeH3">Snacks & impulse items</h3>
              <p className="muted">
                Fast-moving snacks and small treats that work well for kiosks, convenience stores,
                and supermarkets.
              </p>
              <ul className="homeList">
                <li>Clear SKU and case-pack info</li>
                <li>Photo-based catalog for quick selection</li>
                <li>Order requests in minutes</li>
              </ul>
            </div>
          </div>

          <div className="homeCard homeCardTall">
            <div className="homeCardMedia">
              <Image
                src="/home/assorted-snacks.png"
                alt="Assorted snacks and confectionery"
                fill
                className="homeCardImg"
              />
            </div>
            <div className="homeCardBody">
              <h3 className="homeH3">Confectionery & variety boxes</h3>
              <p className="muted">
                Variety assortments and candy selections that are easy to stock and attractive for
                gifting and resale.
              </p>
              <div className="homeCtas">
                <Link className="button" href="/products">See catalog</Link>
                <Link className="button secondary" href="/contact">Ask availability</Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section title="Ready to order?">
        <div className="homeCtaCard">
          <div>
            <h3 className="homeH3">Send an order request</h3>
            <p className="muted">
              Select one or more products, choose your carton quantities, and submit. We will confirm
              availability, pricing, and delivery options.
            </p>
          </div>
          <div className="homeCtas">
            <Link className="button" href="/order">Go to Order page</Link>
            <Link className="button secondary" href="/contact">Contact us</Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
