import Link from "next/link";
import { requireSession } from "@/lib/server-session";
import { listCompanies } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const session = await requireSession();
  const companies = await listCompanies(session.user!.tenantId!);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Org</TH>
              <TH>Location</TH>
            </TR>
          </THead>
          <TBody>
            {companies.map((c: any) => (
              <TR key={c.id} className="hover:bg-surface">
                <TD>
                  <Link href={`/companies/${c.id}`} className="text-brand-blue">{c.name}</Link>
                </TD>
                <TD>{c.org?.name ?? "-"}</TD>
                <TD>{c.location}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
