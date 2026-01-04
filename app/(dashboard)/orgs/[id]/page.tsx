import { notFound } from "next/navigation";
import { requireSession } from "@/lib/server-session";
import { getOrg } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function OrgDetail({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const org = await getOrg(params.id, session.user!.tenantId!);
  if (!org) return notFound();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{org.name}</CardTitle>
          <p className="text-sm text-muted">{org.orgType}</p>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>Companies: {org.companies.length}</p>
          <p>Jobs: {org.jobs.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Location</TH>
              </TR>
            </THead>
            <TBody>
              {org.companies.map((c: any) => (
                <TR key={c.id}>
                  <TD>{c.name}</TD>
                  <TD>{c.location}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
