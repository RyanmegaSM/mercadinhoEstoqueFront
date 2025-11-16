import { type LucideIcon } from "lucide-react";

export interface Action {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
}
