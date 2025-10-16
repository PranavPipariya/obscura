import * as React from "react";
import { Button } from "./button";

interface FeatureButtonProps {
  label: string;
  icon?: React.ElementType;
  iconPlacement?: "left" | "right";
  onClick?: () => void;
}

export function FeatureButton({
  label,
  icon,
  iconPlacement = "right",
  onClick,
}: FeatureButtonProps) {
  return (
    <Button
      effect="expandIcon"
      icon={icon}
      iconPlacement={iconPlacement}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
