import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <>
      <header className="pageHeader">
        <p className="eyebrow">Company profile</p>
        <h1 className="pageTitle">International trade with a practical UAE focus</h1>
        <p className="lead">
          RisingHorn Group is registered in the United States and operates with a UAE-focused
          sourcing and distribution model for high-demand food and consumer products.
        </p>
      </header>

      <Section title="What we do">
        <div className="card rhgAbout">
          <div className="rhgSplit">
            <div className="rhgProse">
              <p className="rhgLead">
                We help buyers, retailers, wholesalers, and partners identify products that can move
                well in market, then organize product details, case packs, order requests, and
                supplier communication into a clearer trade workflow.
              </p>

              <section>
                <h3>Products and services</h3>
                <ul>
                  <li>Importing and supplying popular consumer goods from international markets.</li>
                  <li>Wholesale distribution support for retailers, supermarkets, and local wholesalers.</li>
                  <li>Export coordination and logistics support for bulk shipments.</li>
                  <li>Private sourcing requests for clients with specific category needs.</li>
                </ul>
              </section>

              <section>
                <h3>Core product categories</h3>
                <ul>
                  <li><b>Snacks and confectionery:</b> chips, candy, gum, chocolate, and packaged snacks.</li>
                  <li><b>Beverages and drink mixes:</b> flavored drinks, powdered beverages, energy drinks, and juices.</li>
                  <li><b>Packaged and dry foods:</b> noodles, seasonings, spices, canned products, and staple food items.</li>
                  <li><b>Household and personal care:</b> selected essentials based on market demand.</li>
                </ul>
              </section>

              <section>
                <h3>Why buyers work with us</h3>
                <ul>
                  <li><b>Market fit:</b> attention to fast-moving categories and retail-friendly packaging.</li>
                  <li><b>Supplier coordination:</b> communication around availability, case packs, and order details.</li>
                  <li><b>Logistics awareness:</b> practical support for shipment and distribution requirements.</li>
                  <li><b>Clear follow-up:</b> simple inquiry flows through catalog, email, and WhatsApp.</li>
                </ul>
              </section>
            </div>

            <aside className="rhgAside">
              <div className="rhgAsideCard">
                <h3>Mission</h3>
                <p>
                  To provide reliable access to imported products while keeping communication,
                  sourcing, and logistics coordination straightforward for trade partners.
                </p>
              </div>

              <div className="rhgAsideCard">
                <h3>Markets served</h3>
                <p>
                  Operations and distribution focus on the UAE, with company registration in the
                  United States.
                </p>
              </div>

              <div className="rhgAsideCard">
                <h3>Best next step</h3>
                <p>
                  Browse the catalog or send a request with product categories, target quantity, and
                  destination details.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
