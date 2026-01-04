import { requireSession } from "@/lib/server-session";
import { listDocuments } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const session = await requireSession();
  const docs = await listDocuments(session.user!.tenantId!);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Type</TH>
              <TH>Linked</TH>
            </TR>
          </THead>
          <TBody>
            {docs.map((doc: any) => (
              <TR key={doc.id}>
                <TD>{doc.title}</TD>
                <TD>{doc.docType}</TD>
                <TD>{doc.case?.title || doc.job?.title || doc.person?.fullName || "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
