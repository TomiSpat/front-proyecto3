import { type ClaimStatus, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: ClaimStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_COLORS[status] || "bg-gray-100", "uppercase text-xs font-semibold px-2 py-0.5", className)}
    >
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}
