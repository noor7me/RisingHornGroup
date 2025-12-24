import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <>
      <h1 className="h1">About</h1>

      <Section title="Company Profile">
        <div className="card">
          <p>
            Rising Horn Group is an international trading company registered in Somalia and the United States,
            focused on the import, export, and distribution of food and consumer products for Somali and East African markets.
          </p>
          <p>
            The company specializes in sourcing high-quality, shelf-stable snack foods, confectionery, and seasoning products
            from established manufacturers and authorized distributors, with a strong focus on products originating from Mexico
            and other global sourcing markets.
          </p>
          <p>
            Rising Horn Group aims to bridge global supply chains with local demand by introducing reliable, well-priced,
            and market-appropriate products that meet international quality standards and local consumer preferences.
          </p>
        </div>
      </Section>

      <Section title="Mission">
        <div className="card">
          <p>
            Bridge global supply chains with local demand by delivering trusted products that match local consumer preferences,
            supported by reliable sourcing, quality control, and efficient distribution.
          </p>
        </div>
      </Section>
    </>
  );
}
