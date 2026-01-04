import Link from "next/link";
import { requireSession } from "@/lib/server-session";
import { listOrgs } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function OrgsPage() {
  const session = await requireSession();
  const orgs = await listOrgs(session.user!.tenantId!);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Type</TH>
            </TR>
          </THead>
          <TBody>
            {orgs.map((o: any) => (
              <TR key={o.id}>
                <TD>
                  <Link className="text-brand-blue" href={`/orgs/${o.id}`}>
                    {o.name}
                  </Link>
                </TD>
                <TD>{o.orgType}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
