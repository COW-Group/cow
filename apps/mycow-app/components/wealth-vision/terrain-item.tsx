import type { Terrain } from "@/lib/types"
import { getMilestonesByTerrainId } from "@/app/actions/wealth-vision-actions"
import MilestoneItem from "./milestone-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map } from "lucide-react"

interface TerrainItemProps {
  terrain: Terrain
}

export default async function TerrainItem({ terrain }: TerrainItemProps) {
  const milestones = await getMilestonesByTerrainId(terrain.id)

  return (
    <Card className="mb-4 bg-lime-50 dark:bg-lime-900 border-lime-300 dark:border-lime-700">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Map className="h-5 w-5 text-lime-600" />
          {terrain.title || `Terrain ${terrain.id.substring(0, 4)}`}
        </CardTitle>
      </CardHeader>
      {milestones.length > 0 && (
        <CardContent className="p-4 pt-0">
          <h4 className="text-base font-semibold mb-2 text-muted-foreground">Lengths:</h4>
          {milestones.map((milestone) => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </CardContent>
      )}
    </Card>
  )
}
