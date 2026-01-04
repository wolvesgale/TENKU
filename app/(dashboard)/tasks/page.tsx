import { requireSession } from "@/lib/server-session";
import { readProgramFromCookie } from "@/lib/server-program";
import { listTasks } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await requireSession();
  const program = readProgramFromCookie();
  const tasks = await listTasks(session.user!.tenantId!, program);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Status</TH>
              <TH>Due</TH>
              <TH>Case</TH>
            </TR>
          </THead>
          <TBody>
            {tasks.map((t: any) => (
              <TR key={t.id}>
                <TD>{t.title}</TD>
                <TD><Badge>{t.status}</Badge></TD>
                <TD>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</TD>
                <TD>{t.case?.title ?? "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
