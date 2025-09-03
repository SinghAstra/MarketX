import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const businessId = String(searchParams.business_id || "");
  const businessName = String(searchParams.business_name || "");
  const wabaId = String(searchParams.waba_id || "");
  const wabaName = String(searchParams.waba_name || "");
  const phoneId = String(searchParams.phone_number_id || "");
  const phone = String(searchParams.phone || "");

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-balance">
        WhatsApp Embedded Signup Complete
      </h1>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Business:</span> {businessName || "—"} (
          {businessId || "—"})
        </p>
        <p>
          <span className="font-medium">WABA:</span> {wabaName || "—"} (
          {wabaId || "—"})
        </p>
        <p>
          <span className="font-medium">Phone:</span> {phone || "—"} (
          {phoneId || "—"})
        </p>
      </div>
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
