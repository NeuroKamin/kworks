"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

export default function TestClient() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border border-red-500 flex gap-2 items-center">
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
      <p>Count: {count}</p>
    </div>
  );
}
