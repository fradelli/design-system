import "@fradelli/ui";
import type { AlertProps } from "@fradelli/ui/alert";
import type { AlertDialogContentProps } from "@fradelli/ui/alert-dialog";
import type { BadgeProps } from "@fradelli/ui/badge";
import type { ButtonProps } from "@fradelli/ui/button";
import type { CardProps } from "@fradelli/ui/card";
import { cn } from "@fradelli/ui/cn";
import type { FieldProps } from "@fradelli/ui/field";
import type { InputProps } from "@fradelli/ui/input";
import type { LabelProps } from "@fradelli/ui/label";
import type { LoadingRegionProps } from "@fradelli/ui/loading-region";
import type { NavigationItemProps } from "@fradelli/ui/navigation-item";
import type { PendingButtonProps } from "@fradelli/ui/pending-button";
import type { PopoverContentProps } from "@fradelli/ui/popover";
import type { RadioGroupRootProps } from "@fradelli/ui/radio-group";
import { BarbellIcon, ForkKnifeIcon } from "@fradelli/ui/icons";
import type { SeparatorProps } from "@fradelli/ui/separator";
import type { SheetContentProps } from "@fradelli/ui/sheet";
import type { SkeletonProps } from "@fradelli/ui/skeleton";
import type { StatusBadgeProps } from "@fradelli/ui/status-badge";
import type { SwitchProps } from "@fradelli/ui/switch";

type PublicProps =
  | AlertProps
  | AlertDialogContentProps
  | BadgeProps
  | ButtonProps
  | CardProps
  | FieldProps
  | InputProps
  | LabelProps
  | LoadingRegionProps
  | NavigationItemProps
  | PendingButtonProps
  | PopoverContentProps
  | RadioGroupRootProps
  | SeparatorProps
  | SheetContentProps
  | SkeletonProps
  | StatusBadgeProps
  | SwitchProps;
declare const props: PublicProps;
void props;
void cn("px-2", "px-4");
void BarbellIcon;
void ForkKnifeIcon;
