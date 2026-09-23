import type { ComponentType } from "react";
import { cn } from "../../lib/cn.js";
import { Badge } from "../badge/index.js";

const badgeVariantByTone = {
  neutral: "secondary",
  info: "info",
  success: "success",
  warning: "warning",
  destructive: "destructive",
} as const;
export type StatusBadgeTone = keyof typeof badgeVariantByTone;
export type StatusBadgeIcon = ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
export type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
  Icon?: StatusBadgeIcon;
  className?: string;
};
export function StatusBadge({ className, Icon, label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <Badge
      data-slot="status-badge"
      data-tone={tone}
      variant={badgeVariantByTone[tone]}
      className={cn(className)}
    >
      {Icon ? <Icon aria-hidden /> : null}
      {label}
    </Badge>
  );
}
