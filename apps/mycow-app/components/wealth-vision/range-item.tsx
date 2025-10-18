import type { Range } from "@/lib/types"
import { getMountainsByRangeId } from "@/app/actions/wealth-vision-actions"
import MountainItem from "./mountain-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Telescope } from "lucide-react"

interface RangeItemProps {
  range: Range
}

export default async function RangeItem({ range }: RangeItemProps) {
  const mountains = await getMountainsByRangeId(range.id)

  return (
    <Card className="mb-8 bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-700">
      <CardHeader className="p-6">
        <CardTitle className="text-3xl font-bold flex items-center gap-3">
          <Telescope className="h-8 w-8 text-purple-600" />
          {range.title || `Range ${range.id.substring(0, 4)}`}
        </CardTitle>
      </CardHeader>
      {mountains.length > 0 && (
        <CardContent className="p-6 pt-0">
          <h4 className="text-2xl font-semibold mb-4 text-muted-foreground">Mountains:</h4>
          {mountains.map((mountain) => (
            <MountainItem key={mountain.id} mountain={mountain} />
          ))}
        </CardContent>
      )}
    </Card>
  )
}
