import Section from "../components/Section";

export default function HomePage() {
  return (
    <>
      <p className="p">
        Rising Horn Group is an international trading company registered in Somalia and the United States,
        focused on the import, export, and distribution of food and consumer products for Somali and East African markets.
      </p>

      <Section title="Our Focus">
        <div className="grid">
          <div className="card">
            <strong>Products</strong>
            <p className="p">Shelf-stable snack foods, confectionery, and seasoning products.</p>
          </div>
          <div className="card">
            <strong>Distribution</strong>
            <p className="p">Reliable logistics that bridge global supply chains with local demand.</p>
          </div>
          <div className="card">
            <strong>Value</strong>
            <p className="p">Well-priced, market-appropriate products aligned with local preferences.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
