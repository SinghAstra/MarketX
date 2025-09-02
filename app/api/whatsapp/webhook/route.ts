import { NextRequest, NextResponse } from "next/server";

const META_WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
if (!META_WEBHOOK_VERIFY_TOKEN) {
  throw new Error("META_WEBHOOK_VERIFY_TOKEN for whatsapp webhook missing.");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  console.log("mode is ", mode);
  console.log("token is ", token);
  console.log("challenge is ", challenge);
  console.log("META_WEBHOOK_VERIFY_TOKEN is ", META_WEBHOOK_VERIFY_TOKEN);

  if (mode === "subscribe" && token === META_WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook successfully verified!");
    return NextResponse.json(challenge, { status: 200 });
  } else {
    console.log("Webhook verification failed. Invalid token or mode.");
    return NextResponse.json("Verification failed", { status: 403 });
  }
}
