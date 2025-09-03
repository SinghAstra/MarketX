"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  console.log("searchParams is ", searchParams);
  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Onboarding Error</h1>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    </main>
  );
}
