import type { ReactNode } from 'react';

interface SocialLinkProps {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
}

export default function SocialLink({
  href,
  label,
  external = true,
  children,
}: SocialLinkProps) {
  return (
    <li className="group relative">
      <a
        href={href}
        aria-label={label}
        title={label}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-social text-white/80 transition hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span aria-hidden="true">{children}</span>
      </a>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-dark px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </li>
  );
}
