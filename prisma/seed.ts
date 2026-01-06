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

  const person1 = await prisma.person.create({
    data: {
      tenantId: tenant.id,
      fullName: "Linh Truong",
      nationality: "ベトナム",
      nativeLanguage: "Vietnamese",
      currentProgram: "TITP",
      residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
      passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200),
      currentCompanyId: company?.id,
    },
  });

  const person2 = await prisma.person.create({
    data: {
      tenantId: tenant.id,
      fullName: "Amara Singh",
      nationality: "フィリピン",
      nativeLanguage: "Tagalog",
      currentProgram: "SSW",
      residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
      currentCompanyId: company?.id,
    },
  });

  const job = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      title: "ライン作業スタッフ",
      companyId: company?.id ?? "",
      salary: "月給20万円~",
      workLocation: "北海道札幌市",
      occupation: "製造",
      status: "OPEN",
    },
  });

  const application = await prisma.application.create({
    data: {
      tenantId: tenant.id,
      personId: person1.id,
      companyId: company?.id,
      applicationType: "residence_certificate",
      status: "DRAFT",
    },
  });

  const trainingPlan = await prisma.trainingPlan.create({
    data: {
      tenantId: tenant.id,
      personId: person2.id,
      companyId: company?.id,
      orgId: org.id,
      planType: "skill_practice_plan",
      status: "DRAFT",
    },
  });

  console.log({ tenant, org, companies, person1, person2, job, application, trainingPlan });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
