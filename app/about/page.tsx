import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <main className="container">
      <h1 className="h1">About</h1>

      <Section title="Company Profile" subtitle="Import • Export • Distribution for Somali & East African markets">
        <div className="card rhgAbout">
          <div className="rhgSplit">
            <div className="rhgProse">
              <p className="rhgLead">
                RisingHorn Group is a dynamic import and export company specializing in the sourcing and distribution of
                high-demand consumer goods, snacks, packaged foods, and specialty products for Somali and East African
                markets.
              </p>

              <section>
                <h3>Products &amp; Services</h3>
                <ul>
                  <li>Importing and supplying popular consumer goods from international markets.</li>
                  <li>Wholesale distribution to retailers, supermarkets, and local wholesalers.</li>
                  <li>Export coordination and logistics support for bulk shipments.</li>
                  <li>Private sourcing requests and supply chain support for clients.</li>
                </ul>
              </section>

              <section>
                <h3>Core Product Categories</h3>
                <ul>
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
              </section>

              <section>
                <h3>Why Choose RisingHorn Group</h3>
                <ul>
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
              </section>
            </div>

            <aside className="rhgAside">
              <div className="rhgAsideCard">
                <h3>Mission</h3>
                <p>
                  To provide reliable, high-quality imported products at competitive prices while ensuring efficient
                  logistics and strong supplier relationships.
                </p>
              </div>

              <div className="rhgAsideCard">
                <h3>Markets Served</h3>
                <p>
                  Primary operations focus on Somalia, with expansion plans across East African regions and diaspora
                  supply channels.
                </p>
              </div>

              <div className="rhgAsideCard">
                <h3>Contact</h3>
                <p style={{ marginBottom: 0 }}>
                  For product inquiries, partnership opportunities, or wholesale orders, please contact RisingHorn Group.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </main>
  );
}
