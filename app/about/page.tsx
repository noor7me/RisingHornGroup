import Image from "next/image";
import Link from "next/link";
import Section from "../../components/Section";

const facts = [
  ["Registered", "United States"],
  ["Operating focus", "UAE"],
  ["Work style", "Trade coordination"],
  ["Customers", "Wholesale buyers"],
];

const roles = [
  ["Source", "Identify relevant products and supplier options."],
  ["Organize", "Keep product details, quantities, and requests clear."],
  ["Coordinate", "Support the path from inquiry to next steps."],
];

const principles = [
  "Clear communication",
  "Practical timelines",
  "Retail-ready thinking",
  "Supplier follow-up",
  "Simple ordering",
  "Long-term relationships",
];

export default function AboutPage() {
  return (
    <>
      <section className="aboutHero">
        <div className="aboutHeroCopy">
          <p className="eyebrow">About RisingHorn Group</p>
          <h1 className="pageTitle">A practical trade partner for wholesale sourcing.</h1>
          <p className="aboutDeck">
            We connect buyers with imported food and consumer products through a UAE-focused trade
            workflow.
          </p>
          <div className="pageActions">
            <Link className="button" href="/products">
              View Catalog
            </Link>
            <Link className="button secondary" href="/contact">
              Contact Sales
            </Link>
          </div>
        </div>

        <div className="aboutHeroMedia">
          <Image
            src="/home/hero-distribution-trucks.png"
            alt="Distribution trucks prepared for product delivery"
            fill
            priority
            className="aboutHeroImg"
          />
          <div className="aboutHeroBadge">
            <span>U.S. registered</span>
            <strong>UAE-focused operations</strong>
          </div>
        </div>
      </section>

      <section className="factGrid aboutFacts" aria-label="Company facts">
        {facts.map(([label, value]) => (
          <div className="factCard" key={label}>
            <div className="factLabel">{label}</div>
            <div className="factValue">{value}</div>
          </div>
        ))}
      </section>

      <Section title="Our role">
        <div className="roleGrid">
          {roles.map(([title, text]) => (
            <article className="roleCard" key={title}>
              <div className="roleNumber">{title.slice(0, 1)}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="How we work">
        <div className="principlePanel">
          <div>
            <p className="miniMetric">Operating principles</p>
            <h2>Clear, responsive, and built for repeat trade.</h2>
          </div>
          <div className="principleCloud">
            {principles.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Start with a request">
        <div className="ctaPanel">
          <div>
            <h3 className="cardTitle" style={{ color: "#fff" }}>
              Tell us what you need to source.
            </h3>
            <div className="heroPoints compact" style={{ marginTop: 12 }}>
              <span>Product type</span>
              <span>Quantity</span>
              <span>Destination</span>
            </div>
          </div>
          <div className="ctaRow">
            <Link className="button" href="/order">
              Request Order
            </Link>
            <Link className="button secondary" href="/contact">
              Ask a Question
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
