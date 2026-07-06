import { type Href, Link } from "expo-router";
import type { PropsWithChildren } from "react";

interface SystemLinkProps extends PropsWithChildren {
  href: Href;
  replace?: boolean;
  disabled?: boolean;
  className?: string;
}

function SystemLink({
  href,
  replace = false,
  disabled = false,
  className,
  children,
}: SystemLinkProps) {
  return (
    <Link
      href={href}
      replace={replace}
      disabled={disabled}
      className={`ml-2 font-semibold text-[#3B82F6] ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}

export { SystemLink };
