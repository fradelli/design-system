import { BarbellIcon as PhosphorBarbellIcon } from "@phosphor-icons/react/dist/ssr/Barbell";
import { ForkKnifeIcon as PhosphorForkKnifeIcon } from "@phosphor-icons/react/dist/ssr/ForkKnife";
import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  mirrored?: boolean;
  alt?: string;
};

export function BarbellIcon(props: IconProps) {
  return <PhosphorBarbellIcon {...props} />;
}

export function ForkKnifeIcon(props: IconProps) {
  return <PhosphorForkKnifeIcon {...props} />;
}
