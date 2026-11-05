// The age calculator was removed when SolveGrid refocused on research statistics.
// Googlebot still requests the old URL, so answer 410 Gone (permanently removed) instead of 404,
// which tells search engines to drop it and stop re-crawling it.
export const dynamic = "force-dynamic";

const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page removed (410) | SolveGrid</title></head>
<body style="font-family:system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 16px;line-height:1.6;font-size:16px">
<h1>This page has been removed</h1>
<p>The age calculator is no longer part of SolveGrid. SolveGrid now focuses on free statistics calculators for thesis and survey research.</p>
<p><a href="/tools" style="display:inline-block;padding:12px 0">Browse all SolveGrid calculators</a></p>
</body></html>`;

export function GET() {
  return new Response(body, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600" },
  });
}
