import { notFound } from "next/navigation";
import { requireSession } from "@/lib/server-session";
import { getCompany } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function CompanyDetail({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const company = await getCompany(params.id, session.user!.tenantId!);
  if (!company) return notFound();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
          <p className="text-sm text-muted">{company.location}</p>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Default Org: {company.org?.name ?? "-"}</p>
          <p>Persons: {company.persons.length}</p>
          <p>Jobs: {company.jobs.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Program</TH>
              </TR>
            </THead>
            <TBody>
              {company.cases.map((c: any) => (
                <TR key={c.id}>
                  <TD>{c.title}</TD>
                  <TD>{c.program}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
