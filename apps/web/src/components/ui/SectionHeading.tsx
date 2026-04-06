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
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading mt-4 text-2xl font-semibold uppercase leading-tight tracking-tight text-balance text-zinc-900 sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-500 sm:text-sm md:text-base sm:leading-loose">
          {subtitle}
        </p>
      ) : null}
      {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
    </div>
  );
}
