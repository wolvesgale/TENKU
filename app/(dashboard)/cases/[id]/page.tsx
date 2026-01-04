import { notFound } from "next/navigation";
import { requireSession } from "@/lib/server-session";
import { getCase } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { AutoGenerateTasksButton } from "@/components/cases/auto-generate-button";

export const dynamic = "force-dynamic";

export default async function CaseDetail({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const item = (await getCase(params.id, session.user!.tenantId!)) as any;
  if (!item) return notFound();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <p className="text-sm text-muted">{item.company?.name ?? "-"}</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Program: <Badge>{item.program}</Badge></p>
          <p>Case Type: {item.caseType}</p>
          <p>Status: {item.status}</p>
          <AutoGenerateTasksButton caseId={item.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Due</TH>
              </TR>
            </THead>
            <TBody>
              {item.tasks.map((t: any) => (
                <TR key={t.id}>
                  <TD>{t.title}</TD>
                  <TD>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
