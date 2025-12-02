import { cn } from "@/lib/utils"

interface CompanyLogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function CompanyLogo({ className, showText = true, size = "md" }: CompanyLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo placeholder - replace with actual company logo */}
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold",
          sizeClasses[size],
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      {showText && <span className={cn("font-semibold", textSizeClasses[size])}>ClaimManager</span>}
    </div>
  )
}
