import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Variant styles that use theme CSS variables
    const variantStyles = {
      primary: `
        bg-primary text-primary-foreground
        hover:opacity-90 active:opacity-80
        shadow-sm hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      secondary: `
        bg-secondary text-secondary-foreground
        hover:opacity-90 active:opacity-80
        shadow-sm hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      accent: `
        bg-accent text-accent-foreground
        hover:opacity-90 active:opacity-80
        shadow-sm hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      outline: `
        bg-transparent border-2 border-primary text-primary
        hover:bg-primary/10 active:bg-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      ghost: `
        bg-transparent text-foreground
        hover:bg-muted active:bg-muted/80
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      gradient: `
        bg-gradient-to-r from-primary via-secondary to-accent
        text-white
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      `,
    };

    // Size styles
    const sizeStyles = {
      sm: "h-9 px-3 text-sm gap-1.5",
      md: "h-11 px-4 text-base gap-2",
      lg: "h-14 px-6 text-lg gap-2.5",
      icon: "h-11 w-11 p-0",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : variant === "gradient" ? 1.02 : 1.01 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`
          inline-flex items-center justify-center
          rounded-lg font-medium
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {children && <span className="ml-2">{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

ThemedButton.displayName = "ThemedButton";

// Specialized button variants for common use cases
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ThemedButtonProps, "variant">>(
  (props, ref) => <ThemedButton ref={ref} variant="primary" {...props} />
);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ThemedButtonProps, "variant">>(
  (props, ref) => <ThemedButton ref={ref} variant="secondary" {...props} />
);
SecondaryButton.displayName = "SecondaryButton";

export const AccentButton = React.forwardRef<HTMLButtonElement, Omit<ThemedButtonProps, "variant">>(
  (props, ref) => <ThemedButton ref={ref} variant="accent" {...props} />
);
AccentButton.displayName = "AccentButton";

export const GradientButton = React.forwardRef<HTMLButtonElement, Omit<ThemedButtonProps, "variant">>(
  (props, ref) => <ThemedButton ref={ref} variant="gradient" {...props} />
);
GradientButton.displayName = "GradientButton";

export const OutlineButton = React.forwardRef<HTMLButtonElement, Omit<ThemedButtonProps, "variant">>(
  (props, ref) => <ThemedButton ref={ref} variant="outline" {...props} />
);
OutlineButton.displayName = "OutlineButton";

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ThemedButtonProps, "variant">>(
  (props, ref) => <ThemedButton ref={ref} variant="ghost" {...props} />
);
GhostButton.displayName = "GhostButton";
