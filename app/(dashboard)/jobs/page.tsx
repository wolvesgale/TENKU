import Link from "next/link";
import { requireSession } from "@/lib/server-session";
import { readProgramFromCookie } from "@/lib/server-program";
import { listJobs } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { programLabels } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const session = await requireSession();
  const program = readProgramFromCookie();
  const jobs = await listJobs(session.user!.tenantId!, program);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs</CardTitle>
        <p className="text-sm text-muted">Program: {programLabels[program]}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Program</TH>
              <TH>Company</TH>
            </TR>
          </THead>
          <TBody>
            {jobs.map((job: any) => (
              <TR key={job.id}>
                <TD>
                  <Link href={`/jobs/${job.id}`} className="text-brand-blue">{job.title}</Link>
                </TD>
                <TD><Badge>{job.program}</Badge></TD>
                <TD>{job.company?.name ?? "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
