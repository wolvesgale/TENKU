"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenerateJobOfferButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/v1/jobs/${jobId}/job-offer-pdf`, { method: "POST", body: JSON.stringify({}) });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Generated: ${data.document.url}`);
    } else {
      setMessage(data.error || "Failed to generate");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "求人票PDF生成"}
      </Button>
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}
