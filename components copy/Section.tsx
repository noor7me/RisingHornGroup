export default function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ margin: "26px 0" }}>
      <h2 className="h2">{title}</h2>
      {children}
    </section>
  );
}
