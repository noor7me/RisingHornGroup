import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <>
      <h1 className="h1">About</h1>

      <Section title="Company Profile">
        <div className="card">
          <p className="p">
            Rising Horn Group is an international trading company registered in Somalia and the United States,
            focused on the import, export, and distribution of food and consumer products for the Somali and East African markets.
          </p>
          <p className="p">
            We specialize in sourcing high-quality, shelf-stable snack foods, confectionery, and seasoning products
            from established manufacturers and authorized distributors, with a strong focus on products originating from Mexico
            and other global sourcing markets.
          </p>
          <p className="p">
            Our goal is to bridge global supply chains with local demand by introducing reliable, well-priced, and market-appropriate
            products that meet international quality standards and local consumer preferences.
          </p>
        </div>
      </Section>
    </>
  );
}
