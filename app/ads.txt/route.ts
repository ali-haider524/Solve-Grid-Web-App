import { adsensePublisherId } from "../../lib/site";

export const dynamic = "force-static";

// Authorised Digital Sellers file for Google AdSense (https://support.google.com/adsense/answer/12171612).
export function GET() {
  const body = adsensePublisherId
    ? `google.com, ${adsensePublisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt: add NEXT_PUBLIC_ADSENSE_CLIENT to enable the Google AdSense entry.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
