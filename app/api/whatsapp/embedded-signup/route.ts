import { NextResponse } from "next/server";

export async function POST() {
  const APP_ID = process.env.META_APP_ID;
  const REDIRECT_URI = process.env.META_REDIRECT_URI;
  const CONFIG_ID = process.env.META_CONFIG_ID;

  if (!APP_ID || !REDIRECT_URI || !CONFIG_ID) {
    console.log("Missing Meta configuration environment variables.");
    return NextResponse.json(
      { message: "Missing Meta configuration environment variables." },
      { status: 500 }
    );
  }

  const redirectUrl =
    `https://www.facebook.com/v19.0/dialog/oauth?` +
    `client_id=${APP_ID}&` +
    `redirect_uri=${REDIRECT_URI}&` +
    `response_type=code&` +
    `config_id=${CONFIG_ID}`;

  return NextResponse.json({ redirectUrl }, { status: 200 });
}
