import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-none font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-ink-950 hover:bg-accent-soft hover:-translate-y-0.5",
        outline:
          "border border-line-strong text-fg hover:border-accent/60 hover:bg-ink-800 hover:-translate-y-0.5",
        ghost: "text-fg-muted hover:text-fg",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonVariants = VariantProps<typeof button>;

export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  ...rest
}: ButtonVariants & React.ComponentProps<typeof Link> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(button({ variant, size }), className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  className,
  variant,
  size,
  children,
  ...rest
}: ButtonVariants & React.ComponentProps<"button">) {
  return (
    <button className={cn(button({ variant, size }), className)} {...rest}>
      {children}
    </button>
  );
}
