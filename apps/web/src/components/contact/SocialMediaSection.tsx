import { Mail } from "lucide-react";
import type { ComponentType } from "react";

type Props = {
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function SocialMediaSection({ email, instagram, facebook, whatsapp }: Props) {
  const FacebookIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.3h2.45l.37-2.85H13.5V9.03c0-.83.23-1.4 1.42-1.4h1.52V5.07c-.26-.04-1.16-.11-2.21-.11-2.19 0-3.69 1.34-3.69 3.8v2.12H8.06v2.85h2.48V21h2.96Z" />
    </svg>
  );

  const InstagramIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M17.4 6.9h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );

  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21a9 9 0 0 1-4.2-1.04L3 21l1.1-4.2A9 9 0 1 1 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.05 8.9c.2-.49.4-.5.74-.5h.6c.17 0 .39.06.6.47.2.41.7 1.7.76 1.82.06.12.1.27.02.43-.08.16-.12.27-.25.41-.12.14-.26.32-.37.43-.12.12-.24.24-.1.47.14.23.64 1.04 1.38 1.68.95.83 1.75 1.09 1.98 1.21.23.12.36.1.49-.06.14-.16.56-.65.71-.87.14-.22.29-.18.49-.1.2.08 1.28.6 1.5.71.22.1.37.16.43.25.06.08.06.49-.12.96-.18.47-1.02.92-1.42.97-.39.05-.88.07-1.42-.1-.33-.1-.76-.25-1.3-.49-2.29-1-3.78-3.33-3.9-3.49-.12-.16-.93-1.23-.93-2.35s.58-1.67.79-1.9Z"
        fill="currentColor"
      />
    </svg>
  );

  const items = [
    facebook && isExternalUrl(facebook)
      ? {
          key: "facebook",
          label: "Facebook",
          href: facebook,
          Icon: FacebookIcon,
          className:
            "border-[#1877F2]/20 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
        }
      : null,
    instagram && isExternalUrl(instagram)
      ? {
          key: "instagram",
          label: "Instagram",
          href: instagram,
          Icon: InstagramIcon,
          className:
            "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-700 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-white/15",
        }
      : null,
    whatsapp && isExternalUrl(whatsapp)
      ? {
          key: "whatsapp",
          label: "WhatsApp",
          href: whatsapp,
          Icon: WhatsAppIcon,
          className:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
        }
      : null,
    email
      ? {
          key: "email",
          label: "Email",
          href: `mailto:${email}`,
          Icon: Mail,
          className:
            "border-zinc-900/15 bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white hover:border-zinc-900",
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    href: string;
    Icon: ComponentType<{ className?: string }>;
    className: string;
  }>;

  if (items.length === 0) return null;

  return (
    <div className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:mt-14 sm:p-10 lg:p-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Social
        </p>
        <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
          Follow our latest work
        </h3>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
          Behind-the-scenes, new galleries, and announcements—stay connected.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4">
          {items.map(({ key, href, label, Icon, className }) => (
            <a
              key={key}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              className={[
                "group inline-flex h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all active:scale-[0.98] sm:h-14 sm:px-6 sm:text-base",
                className,
              ].join(" ")}
            >
              <Icon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
              <span className="tracking-[0.02em]">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
