import { pdf } from "@react-pdf/renderer";
import React from "react";
import { ensurePdfSetup } from "./setup";

/**
 * ReadableStream(=Web Stream) を Buffer に変換
 */
async function readableStreamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const buffers = chunks.map((c) => Buffer.from(c));
  return Buffer.concat(buffers);
}

/**
 * @react-pdf/renderer の出力を Buffer に正規化する
 */
async function normalizeToBuffer(val: unknown): Promise<Buffer> {
  // 1) Buffer
  if (Buffer.isBuffer(val)) return val;

  // 2) Uint8Array
  if (val instanceof Uint8Array) return Buffer.from(val);

  // 3) ArrayBuffer
  if (val instanceof ArrayBuffer) return Buffer.from(new Uint8Array(val));

  // 4) ReadableStream (Web Streams)
  if (val && typeof val === "object" && "getReader" in val) {
    // 型安全のためにキャスト（getReader があるなら Web ReadableStream 想定）
    return readableStreamToBuffer(val as ReadableStream<Uint8Array>);
  }

  throw new Error(`renderPdfToBuffer: Unsupported buffer type: ${Object.prototype.toString.call(val)}`);
}

export async function renderPdfToBuffer(element: React.ReactElement): Promise<Buffer> {
  ensurePdfSetup();
  const instance = pdf(element);

  // toBuffer() が Buffer とは限らない環境があるため unknown 扱いで正規化
  const output: unknown = await instance.toBuffer();
  return await normalizeToBuffer(output);
}
