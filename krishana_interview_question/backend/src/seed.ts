import { PrismaClient, Role } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        address: 'Head Office',
        passwordHash,
        role: Role.ADMIN,
      },
    });
    // eslint-disable-next-line no-console
    console.log('Seeded admin user: admin@example.com / Admin@123');
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin user already exists, skipping.');
  }
  // Seed 5 owners with one store each (if not existing)
  const storeSeeds = [
    { name: 'Neon Nexus', email: 'nexus@stores.com', address: '221B Quantum Blvd', ownerEmail: 'owner1@example.com' },
    { name: 'Hyperion Hub', email: 'hyperion@stores.com', address: '404 Singularity Ave', ownerEmail: 'owner2@example.com' },
    { name: 'Aurora Arcade', email: 'aurora@stores.com', address: '7 Aurora Loop', ownerEmail: 'owner3@example.com' },
    { name: 'Fusion Forge', email: 'forge@stores.com', address: '13 Plasma Park', ownerEmail: 'owner4@example.com' },
    { name: 'Circuit City 2.0', email: 'circuit@stores.com', address: '88 Byte Street', ownerEmail: 'owner5@example.com' },
  ];
  for (const seed of storeSeeds) {
    const owner = await prisma.user.upsert({
      where: { email: seed.ownerEmail },
      update: {},
      create: {
        name: `Owner of ${seed.name}`,
        email: seed.ownerEmail,
        address: 'Owner Address',
        passwordHash: await bcrypt.hash('Owner@123', 10),
        role: Role.OWNER,
      },
    });
    const exists = await prisma.store.findFirst({ where: { ownerId: owner.id } });
    if (!exists) {
      await prisma.store.create({ data: { name: seed.name, email: seed.email, address: seed.address, ownerId: owner.id } });
    }
  }
  // eslint-disable-next-line no-console
  console.log('Seeded owners owner1..owner5@example.com (password: Owner@123) each with one store.');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


