import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";

const itemVariants = cva(
  "flex items-center rounded-xl duration-300 ease-linear",
  {
    variants: {
      variant: {
        active: "bg-primary text-primary-foreground hover:bg-primary/90",
        inactive: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        md: "gap-2 px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "inactive",
      size: "md",
    },
  },
);

export type SidebarItemProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> &
  VariantProps<typeof itemVariants> & {
    asChild?: boolean;
    href?: string;
  };

const SidebarItem = forwardRef<ComponentRef<typeof Link>, SidebarItemProps>(
  ({ children, variant, size, href = "", className, asChild, ...props }) => {
    if (asChild) {
      return (
        <button
          className={itemVariants({ variant, size, className })}
          {...props}
        >
          {children}
        </button>
      );
    }
    return (
      <Link
        href={href}
        className={itemVariants({ variant, size, className })}
        // href={'/'}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

SidebarItem.displayName = "Link";

export { SidebarItem, itemVariants };
