import { requireSession } from "@/lib/server-session";
import { listLogs } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const session = await requireSession();
  const logs = await listLogs(session.user!.tenantId!);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Message</TH>
              <TH>Entity</TH>
              <TH>Date</TH>
            </TR>
          </THead>
          <TBody>
            {logs.map((log: any) => (
              <TR key={log.id}>
                <TD>{log.message}</TD>
                <TD>{log.entityType}</TD>
                <TD>{new Date(log.createdAt).toLocaleString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
