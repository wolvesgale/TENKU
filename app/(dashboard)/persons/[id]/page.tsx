import { notFound } from "next/navigation";
import { requireSession } from "@/lib/server-session";
import { getPerson } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function PersonDetail({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const person = (await getPerson(params.id, session.user!.tenantId!)) as any;
  if (!person) return notFound();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{person.fullName}</CardTitle>
          <p className="text-sm text-muted">{person.nationality} / {person.company?.name ?? "Unassigned"}</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Program: <Badge>{person.program}</Badge></p>
          <p>Cases: {person.cases.length}</p>
          <p>Documents: {person.documents.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Status</TH>
                <TH>Program</TH>
                <TH>Date</TH>
              </TR>
            </THead>
            <TBody>
              {person.statusHistory.map((s: any) => (
                <TR key={s.id}>
                  <TD>{s.status}</TD>
                  <TD>{s.program}</TD>
                  <TD>{new Date(s.effectiveDate).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
