"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  console.log("searchParams is ", searchParams);

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-balance">
        WhatsApp Embedded Signup Complete
      </h1>

      <p className="text-sm text-muted-foreground">
        Store these IDs and the access token securely on your server. Consider
        exchanging the short-lived user access token for a long-lived token if
        your app requires it.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </main>
  );
}
