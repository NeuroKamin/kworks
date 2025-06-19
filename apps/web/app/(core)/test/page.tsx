import { Suspense } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

import TestClient from "./client";
import TestAsyncServer from "./server-async";
import TestSyncServer from "./server-sync";

export default function TestPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <TestClient />
      <TestSyncServer />
      <Suspense fallback={<Skeleton className="w-full h-10" />}>
        <TestAsyncServer />
      </Suspense>
    </div>
  );
}
