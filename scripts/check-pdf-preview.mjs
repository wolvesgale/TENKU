#!/usr/bin/env node

/**
 * Minimal non-regression check for the PDF preview API.
 * - Requires the dev server to be running (npm run dev) on the target URL.
 * - Fails if the API is unreachable, not application/pdf, or the payload doesn't start with %PDF-.
 */

const targetBase =
  process.env.PDF_PREVIEW_URL ??
  "http://localhost:3000/api/v1/pdf/preview?templateId=residence-status-change";
const timeoutMs = Number(process.env.PDF_PREVIEW_TIMEOUT_MS ?? 5000);
const url = `${targetBase}${targetBase.includes("?") ? "&" : "?"}t=${Date.now()}`;

async function main() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`[check:pdf] Fetching ${url}`);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "cache-control": "no-store" },
    });

    if (!res.ok) {
      throw new Error(`Unexpected status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/pdf")) {
      throw new Error(`Unexpected content-type: ${contentType || "(none)"}`);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const signature = buf.subarray(0, 5).toString();
    if (signature !== "%PDF-") {
      throw new Error(`Payload does not start with %PDF- (got: ${signature})`);
    }

    const fontStatus = res.headers.get("x-pdf-font") ?? "unknown";
    const fontMessage = res.headers.get("x-pdf-font-message") ?? "";
    console.log(
      `[check:pdf] OK (${buf.length} bytes, font=${fontStatus}${
        fontMessage ? `, message=${fontMessage}` : ""
      })`,
    );
  } catch (err) {
    console.error(`[check:pdf] Failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  } finally {
    clearTimeout(timer);
  }
}

main();
