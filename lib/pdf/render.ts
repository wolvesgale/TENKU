import { pdf } from "@react-pdf/renderer";
import React from "react";

export async function renderPdfToBuffer(element: React.ReactElement) {
  const instance = pdf(element);
  const arrayBuffer = await instance.toBuffer();
  return Buffer.isBuffer(arrayBuffer) ? arrayBuffer : Buffer.from(arrayBuffer);
}
