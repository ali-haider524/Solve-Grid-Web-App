import { goneResponse } from "../../lib/gone";

export const dynamic = "force-dynamic";

// Retired in the research-statistics refocus. 410 tells Google the page is gone for good.
export function GET() {
  return goneResponse("loan calculator");
}
