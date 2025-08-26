"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const FacebookAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("This button will connect to Facebook in Phase 2!");
    }, 1500);
  };

  return (
    <Button
      className="w-full"
      onClick={handleContinue}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Continue with Facebook"}
    </Button>
  );
};

const ApplicationStatusDisplay = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Application Status</h2>
      <p className="text-muted-foreground">
        Your application status will be displayed here after you submit it in a future phase.
      </p>
    </div>
  );
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 ">
      <Card className="w-full max-w-sm rounded-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">WhatsApp Business API</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Get started by connecting your Facebook Business account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FacebookAuthButton />
          <ApplicationStatusDisplay />
        </CardContent>
      </Card>
    </main>
  );
}