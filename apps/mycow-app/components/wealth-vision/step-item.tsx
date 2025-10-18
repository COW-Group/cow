import type { Step } from "@/types/wealth-vision" // Corrected type
import { getBreathsByStepId } from "@/app/actions/wealth-vision-actions" // Corrected import
import BreathItem from "./breath-item" // Corrected import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

interface StepItemProps {
  // Corrected interface name
  step: Step // Corrected prop name and type
}

export default async function StepItem({ step }: StepItemProps) {
  // Corrected component name and prop
  const breaths = await getBreathsByStepId(step.id) // Corrected function call and argument

  return (
    <Card className="mb-2 bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700">
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {step.completed ? ( // Corrected prop usage
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
          {step.title || `Step ${step.id.substring(0, 4)}`} {/* Corrected prop usage and text */}
        </CardTitle>
      </CardHeader>
      {breaths.length > 0 && (
        <CardContent className="p-3 pt-0">
          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Breaths:</h4>
          {breaths.map((breath) => (
            <BreathItem key={breath.id} breath={breath} /> // Corrected component and prop
          ))}
        </CardContent>
      )}
    </Card>
  )
}
