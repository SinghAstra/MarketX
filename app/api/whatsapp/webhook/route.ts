import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
if (!VERIFY_TOKEN) {
  throw new Error("VERIFY_TOKEN for whatsapp webhook missing.");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook successfully verified!");
    return NextResponse.json(challenge, { status: 200 });
  } else {
    console.log("Webhook verification failed. Invalid token or mode.");
    return NextResponse.json("Verification failed", { status: 403 });
  }
}
