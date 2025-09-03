"use client";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToastMessage } = useToastContext();

  const startEmbeddedSignup = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/whatsapp/auth/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setToastMessage(
          data.message || "Failed to initiate signup. Please try again."
        );
      }

      console.log("API response:", data);

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setToastMessage("No redirect URL received from the server.");
      }
    } catch (error) {
      console.log("An unexpected error occurred during startEmbedded Sign Up");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        setToastMessage(error.message);
      } else {
        setToastMessage(
          "An unexpected error occurred during startEmbedded Sign Up"
        );
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:px-8">
      <Button
        variant={"outline"}
        onClick={startEmbeddedSignup}
        disabled={isSubmitting}
        className="flex items-center justify-center px-3 py-2 text-xl bg-muted/40 hover:bg-muted/60 transition-all duration-300"
      >
        {isSubmitting ? (
          <svg
            className="animate-spin h-6 w-6 mr-3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Connect Facebook"
        )}
      </Button>
    </div>
  );
}

export default App;
