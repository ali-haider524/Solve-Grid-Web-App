export async function fetchJson(url, options = {}, label = "request") {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    const detail = body?.error?.message || body?.message || body?.raw || response.statusText;
    throw new Error(`${label} failed (${response.status}): ${detail}`);
  }

  return body;
}
