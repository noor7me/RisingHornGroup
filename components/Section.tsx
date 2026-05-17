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
    <section className="section">
      <div className="sectionHead">
        <div>
          <h2 className="sectionTitle">{title}</h2>
          {subtitle ? (
            <p className="sectionSubtitle">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
