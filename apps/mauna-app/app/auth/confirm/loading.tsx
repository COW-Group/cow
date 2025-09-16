import { Skeleton } from "@/components/ui/skeleton"

export default function ConfirmLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Skeleton className="h-12 w-64 mb-6" />
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}
