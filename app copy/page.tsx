import Link from "next/link";
import Section from "../components/Section";

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <div className="badge">International Trading • Somalia & USA Registered</div>
        <h1 className="h1">Rising Horn Group</h1>
        <p>
          Rising Horn Group is an international trading company registered in Somalia and the United States,
          focused on the import, export, and distribution of food and consumer products for the Somali and East African markets.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <Link className="button" href="/products">Explore Products</Link>
          <Link className="button" href="/contact">Request a Quote</Link>
        </div>
      </div>

      <Section title="What We Do">
        <div className="cardGrid">
          <div className="card">
            <div className="badge">Sourcing</div>
            <p>
              We source high-quality, shelf-stable snack foods, confectionery, and seasoning products
              from established manufacturers and authorized distributors—especially from Mexico and other global markets.
            </p>
          </div>
          <div className="card">
            <div className="badge">Distribution</div>
            <p>
              We bridge global supply chains with local demand by delivering reliable, well-priced, market-appropriate
              products that match consumer preferences.
            </p>
          </div>
          <div className="card">
            <div className="badge">Quality</div>
            <p>
              We focus on products that meet international quality standards with clear labeling, traceability,
              and consistent supply.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Why Rising Horn Group">
        <div className="card">
          <p>
            Our goal is simple: introduce trusted products, at the right price, with dependable logistics—so retailers
            and wholesalers can grow confidently in fast-moving markets.
          </p>
        </div>
      </Section>
    </>
  );
}
