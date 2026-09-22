import "@fradelli/ui";
import type { AlertProps } from "@fradelli/ui/alert";
import type { BadgeProps } from "@fradelli/ui/badge";
import type { ButtonProps } from "@fradelli/ui/button";
import type { CardProps } from "@fradelli/ui/card";
import { cn } from "@fradelli/ui/cn";
import type { FieldProps } from "@fradelli/ui/field";
import type { InputProps } from "@fradelli/ui/input";
import type { LabelProps } from "@fradelli/ui/label";
import type { SeparatorProps } from "@fradelli/ui/separator";
import type { SheetContentProps } from "@fradelli/ui/sheet";
import type { SkeletonProps } from "@fradelli/ui/skeleton";
import type { SwitchProps } from "@fradelli/ui/switch";

type PublicProps =
  | AlertProps
  | BadgeProps
  | ButtonProps
  | CardProps
  | FieldProps
  | InputProps
  | LabelProps
  | SeparatorProps
  | SheetContentProps
  | SkeletonProps
  | SwitchProps;
declare const props: PublicProps;
void props;
void cn("px-2", "px-4");
