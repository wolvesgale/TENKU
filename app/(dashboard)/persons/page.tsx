import Link from "next/link";
import { requireSession } from "@/lib/server-session";
import { readProgramFromCookie } from "@/lib/server-program";
import { listPersons } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { programLabels } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PersonsPage() {
  const session = await requireSession();
  const program = readProgramFromCookie();
  const persons = await listPersons(session.user!.tenantId!, program);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persons</CardTitle>
        <p className="text-sm text-muted">Program filter: {programLabels[program]}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Program</TH>
              <TH>Company</TH>
              <TH>Nationality</TH>
            </TR>
          </THead>
          <TBody>
            {persons.map((p: any) => (
              <TR key={p.id} className="hover:bg-surface">
                <TD>
                  <Link href={`/persons/${p.id}`} className="text-brand-blue">
                    {p.fullName}
                  </Link>
                </TD>
                <TD>
                  <Badge>{p.program}</Badge>
                </TD>
                <TD>{p.company?.name ?? "-"}</TD>
                <TD>{p.nationality}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
