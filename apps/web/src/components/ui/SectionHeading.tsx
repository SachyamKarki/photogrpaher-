import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "center" | "left";
  containerClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "center",
  containerClassName,
}: Props) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div
      className={[
        "mx-auto",
        containerClassName ?? "max-w-3xl",
        alignClass,
      ].join(" ")}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading mt-4 text-3xl font-semibold uppercase leading-[1.05] tracking-tight sm:tracking-tighter text-balance text-black sm:text-5xl lg:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-lg sm:leading-relaxed">
          {subtitle}
        </p>
      ) : null}
      {action ? <div className="mt-10 flex justify-center">{action}</div> : null}
    </div>
  );
}
