export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ margin: "24px 0" }}>
      <h2 style={{ fontSize: 22, margin: "0 0 10px" }}>{title}</h2>
      {children}
    </section>
  );
}
