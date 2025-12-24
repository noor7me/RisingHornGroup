import Section from "../../components/Section";

export default function SourcingPage() {
  return (
    <>
      <h1 className="h1">Sourcing</h1>

      <Section title="How We Source">
        <div className="card">
          <p>
            We prioritize established manufacturers and authorized distributors to ensure authenticity,
            consistent availability, and quality compliance.
          </p>
          <p>
            Our sourcing focus includes Mexico and other global markets known for strong snack and confectionery production.
          </p>
        </div>
      </Section>

      <Section title="Supplier Qualification">
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
            <li>Authorization / distributor verification</li>
            <li>Lot traceability and expiration management</li>
            <li>Packaging integrity and labeling requirements</li>
            <li>Export documentation readiness</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
