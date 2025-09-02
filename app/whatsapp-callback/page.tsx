"use client";

import React, { useEffect, useState } from "react";

// The main component for the callback page
export default function WhatsAppCallback() {
  // State variables for managing the UI and loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // This effect runs once when the component mounts
    const handleCallback = async () => {
      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      // Check if the 'code' parameter exists
      if (code) {
        // If the code exists, it means the user successfully completed the signup flow.
        // Now, we need to send this code to our backend to exchange it for a long-lived access token.
        // This is a crucial step for security.

        try {
          // Make a POST request to your backend API to exchange the code
          // You will need to create a new API route for this, e.g., /api/whatsapp/exchange-token
          const response = await fetch("/api/whatsapp/exchange-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          // Check for a successful response
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to exchange token with the backend."
            );
          }

          // If successful, you can now show a success message to the user.
          setSuccess(true);
          console.log("Successfully exchanged code for token!");
          // You might also want to redirect the user to their dashboard or a confirmation page.
          // For example: window.location.href = '/dashboard';
        } catch (err) {
          console.error("Error during token exchange:", err);
          setError("An unexpected error occurred during token exchange.");
        } finally {
          setLoading(false);
        }
      } else {
        // If the 'code' parameter is not present, it means the user canceled or there was an error.
        setError("Authorization failed or was canceled.");
        setLoading(false);
      }
    };

    handleCallback();
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter p-4 text-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          WhatsApp API Onboarding
        </h1>

        {loading && (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
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
            <p className="mt-4 text-lg text-gray-700">
              Processing your request...
            </p>
          </div>
        )}

        {success && (
          <div className="text-green-600">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-xl font-semibold">Success!</p>
            <p className="mt-2 text-gray-600">
              Your WhatsApp Business account is being configured. You can close
              this page.
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-600">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-xl font-semibold">An Error Occurred</p>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
