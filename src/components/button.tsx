import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  effect?: "expandIcon";
  icon?: React.ElementType;
  iconPlacement?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      effect,
      icon: Icon,
      iconPlacement = "right",
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [hovered, setHovered] = React.useState(false);

    const leftBox =
      effect === "expandIcon"
        ? `inline-flex items-center overflow-hidden transition-all duration-200 ${
            hovered ? "w-5 opacity-100 pr-1.5" : "w-0 opacity-0 pr-0"
          }`
        : "inline-flex items-center w-4 opacity-100";

    const rightBox =
      effect === "expandIcon"
        ? `inline-flex items-center overflow-hidden transition-all duration-200 ${
            hovered
              ? "w-5 opacity-100 pl-1.5"
              : "w-0 opacity-0 pl-0 translate-x-full"
          }`
        : "inline-flex items-center w-4 opacity-100";

    const labelShift =
      effect === "expandIcon"
        ? hovered
          ? iconPlacement === "right"
            ? "-translate-x-0.5"
            : "translate-x-0.5"
          : "translate-x-0"
        : "translate-x-0";

    return (
      <button
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          "group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
          "border border-black/10 bg-white text-black",
          "transition-colors active:scale-95",
          "hover:bg-black/5 active:bg-black/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
          className,
        ].join(" ")}
        {...rest}
      >
        {Icon && iconPlacement === "left" && (
          <span className={leftBox}>
            <Icon />
          </span>
        )}

        <span
          className={["transition-transform duration-200", labelShift].join(
            " ",
          )}
        >
          {children}
        </span>

        {Icon && iconPlacement === "right" && (
          <span className={rightBox}>
            <Icon />
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
