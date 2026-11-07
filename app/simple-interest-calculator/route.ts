import { goneResponse } from "../../lib/gone";

export const dynamic = "force-dynamic";

export function GET() {
  return goneResponse("simple interest calculator");
}
