import { NextResponse } from "next/server";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in?: number;
};

async function graphGet<T>(
  path: string,
  params: Record<string, string>,
  accessToken: string
) {
  const qs = new URLSearchParams({ ...params, access_token: accessToken });
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${path}?${qs.toString()}`,
    {
      // Avoid caching since this is a one-time auth exchange
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph API error on ${path}: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    const err = errorDescription || error || "Authorization failed.";
    const redirect = new URL(
      `/whatsapp/onboarding/error?message=${encodeURIComponent(err)}`,
      url
    );
    return NextResponse.redirect(redirect);
  }

  const APP_ID = process.env.META_APP_ID;
  const APP_SECRET = process.env.META_APP_SECRET;
  const REDIRECT_URI = process.env.META_REDIRECT_URI;

  if (!APP_ID || !APP_SECRET || !REDIRECT_URI) {
    const redirect = new URL(
      `/whatsapp/onboarding/error?message=${encodeURIComponent(
        "Server missing META_APP_ID, META_APP_SECRET, or META_REDIRECT_URI"
      )}`,
      url
    );
    return NextResponse.redirect(redirect);
  }

  // IMPORTANT: redirect_uri must match exactly what was used to start the flow
  // and what's configured in Meta's Valid OAuth Redirect URIs.
  // e.g. https://web-marketx.vercel.app/whatsapp/onboarding/callback

  if (!code) {
    const redirect = new URL(
      `/whatsapp/onboarding/error?message=${encodeURIComponent(
        "Missing 'code' in callback"
      )}`,
      url
    );
    return NextResponse.redirect(redirect);
  }

  try {
    // 1) Exchange code -> short-lived user access token
    const tokenParams = new URLSearchParams({
      client_id: APP_ID,
      redirect_uri: REDIRECT_URI,
      client_secret: APP_SECRET,
      code,
    });
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`,
      {
        cache: "no-store",
      }
    );
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      throw new Error(`Token exchange failed: ${tokenRes.status} ${text}`);
    }
    const tokenJson = (await tokenRes.json()) as TokenResponse;
    const accessToken = tokenJson.access_token;

    // 2) Retrieve business(es) connected to the user
    const businesses = await graphGet<{
      data: { id: string; name?: string }[];
    }>("me/businesses", { fields: "id,name" }, accessToken);
    const firstBusiness = businesses?.data?.[0];
    if (!firstBusiness) {
      throw new Error("No Business found on the authenticated user.");
    }

    // 3) Retrieve owned WhatsApp Business Accounts (WABAs) for that Business
    const wabas = await graphGet<{ data: { id: string; name?: string }[] }>(
      `${firstBusiness.id}/owned_whatsapp_business_accounts`,
      { fields: "id,name" },
      accessToken
    );
    const firstWaba = wabas?.data?.[0];
    if (!firstWaba) {
      throw new Error(
        "No WhatsApp Business Account found for the selected Business."
      );
    }

    // 4) Retrieve phone numbers in the selected WABA
    const numbers = await graphGet<{
      data: {
        id: string;
        display_phone_number?: string;
        verified_name?: string;
      }[];
    }>(
      `${firstWaba.id}/phone_numbers`,
      { fields: "id,display_phone_number,verified_name" },
      accessToken
    );

    const firstNumber = numbers?.data?.[0];

    // NOTE: At this point, you likely want to persist:
    // - accessToken (short-lived; consider exchanging for long-lived or using your app's backend flow)
    // - business id/name
    // - waba id/name
    // - phone_number id/display_phone_number
    //
    // Since this demo has no DB, we pass basic details via querystring to a success page.

    const successParams = new URLSearchParams({
      business_id: firstBusiness.id,
      business_name: firstBusiness.name || "",
      waba_id: firstWaba.id,
      waba_name: firstWaba.name || "",
      phone_number_id: firstNumber?.id || "",
      phone: firstNumber?.display_phone_number || "",
    });

    const redirect = new URL(
      `/whatsapp/onboarding/success?${successParams.toString()}`,
      url
    );
    return NextResponse.redirect(redirect);
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Unknown error during callback";
    const redirect = new URL(
      `/whatsapp/onboarding/error?message=${encodeURIComponent(msg)}`,
      url
    );
    return NextResponse.redirect(redirect);
  }
}
