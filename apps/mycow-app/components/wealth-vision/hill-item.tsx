import type { Hill } from "@/lib/types"
import { getTerrainsByHillId } from "@/app/actions/wealth-vision-actions"
import TerrainItem from "./terrain-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MountainIcon as HillIcon } from "lucide-react" // Using MountainIcon for Hill as a smaller peak

interface HillItemProps {
  hill: Hill
}

export default async function HillItem({ hill }: HillItemProps) {
  const terrains = await getTerrainsByHillId(hill.id)

  return (
    <Card className="mb-4 bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700">
      <CardHeader className="p-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <HillIcon className="h-6 w-6 text-green-600 transform scale-75" /> {/* Smaller icon for Hill */}
          {hill.title || `Hill ${hill.id.substring(0, 4)}`}
        </CardTitle>
      </CardHeader>
      {terrains.length > 0 && (
        <CardContent className="p-4 pt-0">
          <h4 className="text-lg font-semibold mb-3 text-muted-foreground">Terrains:</h4>
          {terrains.map((terrain) => (
            <TerrainItem key={terrain.id} terrain={terrain} />
          ))}
        </CardContent>
      )}
    </Card>
  )
}
