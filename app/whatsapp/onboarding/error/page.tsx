import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const message = String(searchParams.message || "Onboarding failed.");
  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Onboarding Error</h1>
      <p className="text-sm text-red-600">{message}</p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    </main>
  );
}
