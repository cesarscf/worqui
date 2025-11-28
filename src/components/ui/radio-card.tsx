import * as React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface RadioCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  id: string
  icon?: React.ReactNode
  title: string
  description?: string
}

const RadioCard = React.forwardRef<HTMLDivElement, RadioCardProps>(
  ({ value, id, icon, title, description, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <RadioGroupItem
          value={value}
          id={id}
          className="peer sr-only"
          aria-label={title}
        />
        <Label
          htmlFor={id}
          className={cn(
            "flex items-center gap-3 rounded-lg border-2 border-input bg-background p-4 hover:bg-accent hover:text-accent-foreground",
            "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent",
            "cursor-pointer transition-colors",
          )}
        >
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </Label>
      </div>
    )
  },
)
RadioCard.displayName = "RadioCard"

export { RadioCard }
