import Section from "../../components/Section";

export default function MarketsPage() {
  return (
    <>
      <h1 className="h1">Markets</h1>

      <Section title="Regional Focus">
        <div className="card">
          <p>
            Rising Horn Group serves Somali and broader East African markets, aligning product selection with
            local preferences, retail realities, and shipping practicality.
          </p>
        </div>
      </Section>

      <Section title="Customer Types">
        <div className="cardGrid">
          <div className="card">
            <div className="badge">Wholesalers</div>
            <p>Reliable bulk supply and consistent replenishment.</p>
          </div>
          <div className="card">
            <div className="badge">Retailers</div>
            <p>Fast-moving SKUs sized for local shelves and demand.</p>
          </div>
          <div className="card">
            <div className="badge">Distributors</div>
            <p>Territory expansion support and portfolio growth.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
