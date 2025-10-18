import type { Length } from "@/types/wealth-vision" // Corrected type
import { getStepsByLengthId } from "@/app/actions/wealth-vision-actions" // Corrected import
import StepItem from "./step-item" // Corrected import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface LengthItemProps {
  // Corrected interface name
  length: Length // Corrected prop name and type
}

export default async function LengthItem({ length }: LengthItemProps) {
  // Corrected component name and prop
  const steps = await getStepsByLengthId(length.id) // Corrected function call and argument

  return (
    <Card className="mb-3 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
      <CardHeader className="p-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          {length.title || `Length ${length.id.substring(0, 4)}`} {/* Corrected prop usage and text */}
        </CardTitle>
      </CardHeader>
      {steps.length > 0 && (
        <CardContent className="p-4 pt-0">
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Steps:</h4>
          {steps.map((step) => (
            <StepItem key={step.id} step={step} /> // Corrected component and prop
          ))}
        </CardContent>
      )}
    </Card>
  )
}
