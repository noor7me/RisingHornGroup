import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <main className="container">
      <h1 className="h1">About</h1>

      <Section title="Company Profile" subtitle="Import • Export • Distribution for Somali & East African markets">
        <div className="card" style={{ display: "grid", gap: 14 }}>
          <p className="p">
            RisingHorn Group is a dynamic import and export company specializing in the sourcing and distribution of
            high-demand consumer goods, snacks, packaged foods, and specialty products for Somali and East African
            markets.
          </p>

          <div>
            <h3 style={{ marginBottom: 6, fontSize: 20 }}>
              1. Mission
            </h3>
            <p className="p" style={{ marginBottom: 0 }}>
              To provide reliable, high-quality imported products at competitive prices while ensuring efficient
              logistics and strong supplier relationships.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 6, fontSize: 20 }}>
              2. Products &amp; Services
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>Importing and supplying popular consumer goods from international markets.</li>
              <li>Wholesale distribution to retailers, supermarkets, and local wholesalers.</li>
              <li>Export coordination and logistics support for bulk shipments.</li>
              <li>Private sourcing requests and supply chain support for clients.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: 6, fontSize: 20 }}>
              3. Core Product Categories
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>
                <b>Snacks &amp; Confectionery:</b> chips, candy, gum, chocolate, and packaged snacks.
              </li>
              <li>
                <b>Beverages &amp; Drink Mixes:</b> flavored drinks, powdered beverages, energy drinks, and juices.
              </li>
              <li>
                <b>Packaged &amp; Dry Foods:</b> noodles, seasonings, spices, canned products, and staple food items.
              </li>
              <li>
                <b>Household &amp; Personal Care:</b> select hygiene and household essentials based on market demand.
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: 6, fontSize: 20 }}>
              4. Why Choose RisingHorn Group
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>
                <b>Market Insight:</b> deep understanding of product demand trends in Somali and East African
                communities.
              </li>
              <li>
                <b>Trusted Supply Chain:</b> partnerships with dependable exporters and suppliers.
              </li>
              <li>
                <b>Efficient Logistics:</b> streamlined shipping and distribution networks.
              </li>
              <li>
                <b>Customer Focus:</b> customized sourcing and flexible order options for clients.
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: 6, fontSize: 20 }}>
              5. Markets Served
            </h3>
            <p className="p" style={{ marginBottom: 0 }}>
              Primary operations focus on Somalia, with expansion plans across East African regions and diaspora supply
              channels.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: 6, fontSize: 20 }}>
              6. Contact
            </h3>
            <p className="p" style={{ marginBottom: 0 }}>
              For product inquiries, partnership opportunities, or wholesale orders, please contact RisingHorn Group.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
