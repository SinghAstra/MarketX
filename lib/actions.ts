"use server";

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: string;
}

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    // Validate required fields
    if (!to) {
      return { success: false, error: "Phone number is required" };
    }

    // Get WhatsApp API credentials from environment variables
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      return {
        success: false,
        error:
          "WhatsApp API credentials not configured. Please add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to your environment variables.",
      };
    }

    console.log("[v0] accessToken is ", accessToken);
    console.log("[v0] phoneNumberId is ", phoneNumberId);

    // Format phone number (remove any non-digit characters except +)
    const formattedPhone = to.replace(/[^\d+]/g, "");

    // WhatsApp Business API endpoint
    const whatsappApiUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

    const response = await fetch(whatsappApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
        },
      }),
    });

    const responseData = await response.json();

    console.log("[v0] responseData is ", responseData);

    if (!response.ok) {
      console.error("WhatsApp API Error:", responseData);

      let errorMessage = "Failed to send WhatsApp message";
      let details = responseData.error?.message || "Unknown error";

      // Handle specific error codes
      if (
        responseData.error?.code === 100 &&
        responseData.error?.error_subcode === 33
      ) {
        errorMessage = "WhatsApp Phone Number ID is invalid or doesn't exist";
        details = `Phone Number ID '${phoneNumberId}' not found. Please verify your WHATSAPP_PHONE_NUMBER_ID in Meta Business Manager.`;
      } else if (responseData.error?.code === 190) {
        errorMessage = "WhatsApp Access Token is invalid or expired";
        details =
          "Please generate a new access token from Meta Business Manager.";
      } else if (responseData.error?.code === 131009) {
        errorMessage = "Phone number not registered with WhatsApp Business";
        details =
          "The recipient phone number must have WhatsApp installed and be registered.";
      }

      return {
        success: false,
        error: errorMessage,
        details: details,
      };
    }

    return {
      success: true,
      messageId: responseData.messages?.[0]?.id,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: "Internal server error" };
  }
}
