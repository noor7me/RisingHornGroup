import Section from "../../components/Section";

const categories = [
  { title: "Snack Foods", desc: "Chips, crunchy snacks, shelf-stable savory items." },
  { title: "Confectionery", desc: "Candy, gummies, chocolate, and assorted sweets." },
  { title: "Seasonings", desc: "Spice blends, seasonings, and shelf-stable cooking enhancers." }
];

export default function ProductsPage() {
  return (
    <>
      <h1 className="h1">Products</h1>
      <p>Core categories we distribute and source for Somali and East African markets.</p>

      <Section title="Categories">
        <div className="cardGrid">
          {categories.map((c) => (
            <div className="card" key={c.title}>
              <div className="badge">{c.title}</div>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Next Step">
        <div className="card">
          <p>
            When you’re ready, we can add specific brand lines/SKUs and turn this into a catalog page
            (with filters + downloadable line sheet).
          </p>
        </div>
      </Section>
    </>
  );
}
