import { notFound } from "next/navigation";
import { requireSession } from "@/lib/server-session";
import { getJob } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { GenerateJobOfferButton } from "@/components/jobs/generate-job-offer-button";

export const dynamic = "force-dynamic";

export default async function JobDetail({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const job = await getJob(params.id, session.user!.tenantId!);
  if (!job) return notFound();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <p className="text-sm text-muted">{job.company?.name ?? "Unassigned"}</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Program: <Badge>{job.program}</Badge></p>
          <p>Assigned Org: {job.assignedOrg?.name ?? "None"}</p>
          <p>Job Offer Version: {job.jobOfferVersion}</p>
          <GenerateJobOfferButton jobId={job.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Type</TH>
              </TR>
            </THead>
            <TBody>
              {job.documents.map((doc: any) => (
                <TR key={doc.id}>
                  <TD>{doc.title}</TD>
                  <TD>{doc.docType}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
