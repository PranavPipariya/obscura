import * as React from "react";
import { Button } from "./button";

interface FeatureCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonIcon?: React.ElementType;
  buttonPlacement?: "left" | "right";
  onButtonClick?: () => void;
}

export function FeatureCard({
  title,
  description,
  buttonLabel,
  buttonIcon,
  buttonPlacement = "right",
  onButtonClick,
}: FeatureCardProps) {
  return (
    <article className="relative flex min-h-[26rem] flex-col rounded-2xl border border-black/10 bg-white p-8">
      <div className="text-lg leading-relaxed text-black/80">
        <p className="text-2xl font-semibold">{title}</p>
        <p className="mt-4">{description}</p>
      </div>

      <div className="absolute bottom-6 right-6">
        <Button
          effect="expandIcon"
          icon={buttonIcon}
          iconPlacement={buttonPlacement}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </article>
  );
}
