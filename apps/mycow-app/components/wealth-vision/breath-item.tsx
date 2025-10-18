import type { Breath } from "@/types/wealth-vision" // Corrected type
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, Square } from "lucide-react"

interface BreathItemProps {
  // Corrected interface name
  breath: Breath // Corrected prop name and type
}

export default function BreathItem({ breath }: BreathItemProps) {
  // Corrected component name and prop
  return (
    <Card className="mb-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs">{breath.label}</span> {/* Corrected prop usage */}
          {breath.completed ? ( // Corrected prop usage
            <CheckSquare className="h-3 w-3 text-green-500" />
          ) : (
            <Square className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
