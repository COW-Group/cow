import type { Mountain } from "@/lib/types"
import { getHillsByMountainId } from "@/app/actions/wealth-vision-actions"
import HillItem from "./hill-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MountainIcon } from "lucide-react"

interface MountainItemProps {
  mountain: Mountain
}

export default async function MountainItem({ mountain }: MountainItemProps) {
  const hills = await getHillsByMountainId(mountain.id)

  return (
    <Card className="mb-6 bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <MountainIcon className="h-7 w-7 text-blue-500" />
          {mountain.title || `Mountain ${mountain.id.substring(0, 4)}`}
        </CardTitle>
      </CardHeader>
      {hills.length > 0 && (
        <CardContent className="p-6 pt-0">
          <h4 className="text-xl font-semibold mb-4 text-muted-foreground">Hills:</h4>
          {hills.map((hill) => (
            <HillItem key={hill.id} hill={hill} />
          ))}
        </CardContent>
      )}
    </Card>
  )
}
