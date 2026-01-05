/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { code: "TENKU_DEMO" },
    update: {},
    create: { code: "TENKU_DEMO", name: "TENKU Demo Tenant" },
  });

  const org = await prisma.organization.create({
    data: { tenantId: tenant.id, orgType: "SUPPORT", displayName: "TENKU Support Org" },
  });

  const companies = await prisma.company.createMany({
    data: [
      { tenantId: tenant.id, name: "Orion Logistics", address: "北海道札幌市", defaultOrgId: org.id, defaultOrgType: org.orgType },
      { tenantId: tenant.id, name: "Aster Foods", address: "宮城県仙台市", defaultOrgId: org.id, defaultOrgType: org.orgType },
      { tenantId: tenant.id, name: "Nova Robotics", address: "愛知県名古屋市", defaultOrgId: org.id, defaultOrgType: org.orgType },
    ],
  });

  const company = await prisma.company.findFirst({ where: { tenantId: tenant.id } });

  const persons = await prisma.person.createMany({
    data: [
      {
        tenantId: tenant.id,
        fullName: "Linh Truong",
        nationality: "ベトナム",
        nativeLanguage: "Vietnamese",
        currentProgram: "TITP",
        residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
        passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200),
        currentCompanyId: company?.id,
      },
      {
        tenantId: tenant.id,
        fullName: "Amara Singh",
        nationality: "フィリピン",
        nativeLanguage: "Tagalog",
        currentProgram: "SSW",
        residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
        currentCompanyId: company?.id,
      },
      {
        tenantId: tenant.id,
        fullName: "Rafi Putra",
        nationality: "インドネシア",
        nativeLanguage: "Indonesian",
        currentProgram: "TA",
        residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
        passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 400),
        currentCompanyId: company?.id,
      },
    ],
  });

  console.log({ tenant, org, companies, persons });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
