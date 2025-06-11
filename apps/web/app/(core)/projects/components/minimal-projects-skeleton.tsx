import { Skeleton } from "@workspace/ui/components/skeleton";

export function MinimalProjectsSkeleton() {
    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                {/* Заголовок */}
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Простая индикация загрузки */}
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="space-y-4 text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <Skeleton className="h-4 w-32 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}