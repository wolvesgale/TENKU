import { requireSession } from "@/lib/server-session";
import { readProgramFromCookie } from "@/lib/server-program";
import { getDashboardSummary } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { programLabels } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const program = readProgramFromCookie();
  const { caseCount, taskCount, alertCount, recentLogs } = await getDashboardSummary(session.user!.tenantId!, program);
  const alerts = await prisma.alert.findMany({ where: { tenantId: session.user!.tenantId! }, take: 5 });

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cases</CardTitle>
            <p className="text-sm text-muted">Program: {programLabels[program]}</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{caseCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open Tasks</CardTitle>
            <p className="text-sm text-muted">未完了のタスク数</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{taskCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <p className="text-sm text-muted">重要通知</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{alertCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Title</TH>
                  <TH>Severity</TH>
                </TR>
              </THead>
              <TBody>
                {alerts.map((a) => (
                  <TR key={a.id}>
                    <TD>{a.title}</TD>
                    <TD>
                      <Badge className={a.severity === "CRITICAL" ? "border-rose-400 text-rose-200" : a.severity === "WARN" ? "border-brand-amber text-brand-amber" : undefined}>
                        {a.severity}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted">
              {recentLogs.map((log: any) => (
                <li key={log.id} className="flex items-center justify-between border border-border rounded-lg px-3 py-2">
                  <span>{log.message}</span>
                  <span className="text-xs">{new Date(log.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
