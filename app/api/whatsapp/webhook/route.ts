export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

  console.log("mode is ", mode);
  console.log("token is ", token);
  console.log("challenge is ", challenge);
  console.log(
    "META_WEBHOOK_VERIFY_TOKEN is ",
    verifyToken ? "[present]" : "[missing]"
  );

  if (!verifyToken) {
    return new Response(
      "Server misconfigured: missing META_WEBHOOK_VERIFY_TOKEN",
      { status: 500 }
    );
  }

  if (mode === "subscribe" && token === verifyToken) {
    console.log("Verified Successfully");
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response("Verification failed", { status: 403 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    console.log("WhatsApp Webhook Event:", JSON.stringify(body));
    return new Response("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.log("WhatsApp Webhook Error parsing payload");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return new Response("Bad Request", { status: 400 });
  }
}
