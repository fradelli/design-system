import type { SVGProps } from "react";

/** Shared SVG contract preserved by aggregate and individual SSR icon exports. */
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  mirrored?: boolean;
  alt?: string;
};
