import Section from "../../components/Section";

const categories = [
  { title: "Snack Foods", desc: "Chips, crunchy snacks, shelf-stable savory items." },
  { title: "Confectionery", desc: "Candy, gummies, chocolate, and assorted sweets." },
  { title: "Seasonings", desc: "Spice blends and shelf-stable cooking enhancers." }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && Array.isArray(json.products)) setProducts(json.products);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

return (
    <>
      <h1 className="h1">Products</h1>
      <p className="p">Core categories we distribute and source for Somali and East African markets.</p>

      <Section title="Categories">
        <div className="grid">
          {categories.map((c) => (
            <div className="card" key={c.title}>
              <strong>{c.title}</strong>
              <p className="p">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
