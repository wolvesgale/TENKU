import Link from "next/link";
import { requireSession } from "@/lib/server-session";
import { readProgramFromCookie } from "@/lib/server-program";
import { listCases } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { programLabels } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const session = await requireSession();
  const program = readProgramFromCookie();
  const cases = await listCases(session.user!.tenantId!, program);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cases</CardTitle>
        <p className="text-sm text-muted">Program: {programLabels[program]}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Program</TH>
              <TH>Company</TH>
              <TH>Person</TH>
            </TR>
          </THead>
          <TBody>
            {cases.map((c: any) => (
              <TR key={c.id}>
                <TD>
                  <Link href={`/cases/${c.id}`} className="text-brand-blue">{c.title}</Link>
                </TD>
                <TD><Badge>{c.program}</Badge></TD>
                <TD>{c.company?.name ?? "-"}</TD>
                <TD>{c.person?.fullName ?? "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
