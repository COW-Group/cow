import { WealthVisionSection } from "@/components/wealth-vision-section"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function WealthVisionPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          Wealth Vision: <span className="text-primary">Cycles of Wealth</span>
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Visualize your financial journey from grand ranges to the smallest breaths.
        </p>
      </header>

      {/* The WealthVisionSection now handles fetching and displaying all ranges */}
      <ScrollArea className="h-[calc(100vh-250px)]">
        <WealthVisionSection />
      </ScrollArea>
    </div>
  )
}
