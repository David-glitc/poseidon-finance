import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title && <div className="panel-header">{title}</div>}
      <div className={title ? "p-5" : "p-5"}>{children}</div>
    </section>
  );
}
