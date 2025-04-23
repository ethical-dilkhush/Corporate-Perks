import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create test company
  const testCompanyId = '00000000-0000-0000-0000-000000000001';
  const company = await prisma.company.upsert({
    where: { id: testCompanyId },
    update: {},
    create: {
      id: testCompanyId,
      name: 'Test Company',
      description: 'A test company for the corporate perks platform',
      website: 'https://testcompany.com',
      status: 'APPROVED',
    },
  });

  // Create test company admin
  const companyAdmin = await prisma.user.upsert({
    where: { email: 'company@test.com' },
    update: {},
    create: {
      email: 'company@test.com',
      name: 'Company Admin',
      role: 'COMPANY',
      companyId: company.id,
      emailVerified: new Date(),
    },
  });

  // Create test employee
  const employee = await prisma.user.upsert({
    where: { email: 'employee@test.com' },
    update: {},
    create: {
      email: 'employee@test.com',
      name: 'Test Employee',
      role: 'EMPLOYEE',
      companyId: company.id,
      emailVerified: new Date(),
    },
  });

  // Create test offers
  const offer1 = await prisma.offer.create({
    data: {
      title: '50% Off on Electronics',
      description: 'Get 50% off on all electronics purchases',
      discountValue: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      companyId: company.id,
      eligibleCompanies: {
        create: {
          companyId: company.id,
        },
      },
    },
  });

  const offer2 = await prisma.offer.create({
    data: {
      title: 'Free Shipping',
      description: 'Free shipping on all orders',
      discountValue: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      companyId: company.id,
      eligibleCompanies: {
        create: {
          companyId: company.id,
        },
      },
    },
  });

  // Create test coupons
  await prisma.coupon.create({
    data: {
      code: 'TEST50',
      userId: employee.id,
      offerId: offer1.id,
      status: 'ACTIVE',
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FREESHIP',
      userId: employee.id,
      offerId: offer2.id,
      status: 'USED',
      redeemedAt: new Date(),
    },
  });

  console.log('Test data created successfully!');
  console.log('\nTest Accounts:');
  console.log('\nAdmin User:');
  console.log('Email: admin@test.com');
  console.log('\nCompany Admin:');
  console.log('Email: company@test.com');
  console.log('\nEmployee:');
  console.log('Email: employee@test.com');
  console.log('\nTest Coupons:');
  console.log('Active Coupon: TEST50');
  console.log('Used Coupon: FREESHIP');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 