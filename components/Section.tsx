import React from "react";

export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ margin: "40px 0" }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>{title}</h2>
        {subtitle ? (
          <p style={{ margin: "10px 0 0", opacity: 0.85, maxWidth: 760 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
