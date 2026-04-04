type Props = {
  className?: string;
};

export function LogoMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="6" width="52" height="52" rx="14" className="fill-current" />
      <path
        d="M32 18L39.8 24.2L36.9 33.7L27.1 33.7L24.2 24.2L32 18Z"
        className="fill-white"
      />
      <path
        d="M32 46C39.732 46 46 39.732 46 32"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18 32C18 39.732 24.268 46 32 46"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 18C24.268 18 18 24.268 18 32"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M46 32C46 24.268 39.732 18 32 18"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="4.5" className="fill-white" />
    </svg>
  );
}

