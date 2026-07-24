import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ChargeMitra Database for India...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedHostPassword = await bcrypt.hash('host123', 10);

  // 1. Sole Platform Owner & Admin Account (Cannot be registered publicly)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chargeshare.in' },
    update: {},
    create: {
      email: 'admin@chargeshare.in',
      name: 'ChargeMitra Platform Admin',
      phone: '+919999900000',
      passwordHash: hashedAdminPassword,
      roles: ['DRIVER', 'OWNER', 'ADMIN'], // Sole Admin Account
      rating: 5.0,
      trustScore: 100,
      upiId: 'admin@upi',
      wallet: {
        create: { balance: 50000, currency: 'INR' },
      },
    },
  });

  // 2. Charger Hosts
  const hostRajesh = await prisma.user.upsert({
    where: { email: 'host.rajesh@chargeshare.in' },
    update: {},
    create: {
      email: 'host.rajesh@chargeshare.in',
      name: 'Rajesh Sharma (Host)',
      phone: '+919811122233',
      passwordHash: hashedHostPassword,
      roles: ['DRIVER', 'OWNER'],
      rating: 4.9,
      trustScore: 98,
      upiId: 'rajesh@upi',
      accountNumber: '998877665544',
      ifscCode: 'SBIN0001234',
      wallet: { create: { balance: 8080, currency: 'INR' } },
    },
  });

  const hostPriya = await prisma.user.upsert({
    where: { email: 'host.priya@chargeshare.in' },
    update: {},
    create: {
      email: 'host.priya@chargeshare.in',
      name: 'Priya Nair (Host)',
      phone: '+919822233344',
      passwordHash: hashedHostPassword,
      roles: ['DRIVER', 'OWNER'],
      rating: 4.8,
      trustScore: 96,
      upiId: 'priya@upi',
      wallet: { create: { balance: 14500, currency: 'INR' } },
    },
  });

  // 3. Approved Chargers
  await prisma.charger.createMany({
    data: [
      {
        ownerId: hostRajesh.id,
        title: 'Indiranagar 100kW Ultra-Fast CCS2 Station',
        description: 'Private 100kW dual gun CCS2 fast charger in prime Indiranagar location.',
        brand: 'Tata Power EZ Charge',
        model: '100kW Dual Gun DC',
        propertyType: 'SHOP',
        status: 'APPROVED',
        street: '100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        latitude: 12.9784,
        longitude: 77.6408,
        pricePerHour: 150,
        pricePerKwh: 16.5,
        powerKw: 100,
        chargerType: 'DC_FAST',
        connectorType: 'CCS_2',
        operates24_7: true,
        isAvailable: true,
        amenities: ['CCTV', 'Covered Parking', 'WiFi', 'Security Guard', 'Cafe'],
        photos: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
        averageRating: 4.9,
        totalReviews: 42,
      },
      {
        ownerId: hostPriya.id,
        title: 'BKC Supercharge Hub 150kW Dual Gun',
        description: 'Ultra-fast DC charger located in G-Block BKC underground garage.',
        brand: 'Magenta ChargeGrid',
        model: '150kW Supercharger',
        propertyType: 'OFFICE',
        status: 'APPROVED',
        street: 'G Block, Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400051',
        latitude: 19.0657,
        longitude: 72.8686,
        pricePerHour: 180,
        pricePerKwh: 18.0,
        powerKw: 150,
        chargerType: 'SUPERCHARGER',
        connectorType: 'CCS_2',
        operates24_7: true,
        isAvailable: true,
        amenities: ['CCTV', 'Covered Parking', 'Washroom', 'Security Guard'],
        photos: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop'],
        averageRating: 4.8,
        totalReviews: 38,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Pending Charger Submission
  await prisma.charger.create({
    data: {
      ownerId: hostRajesh.id,
      title: 'Whitefield Dual 60kW Fast CCS2 Charger',
      description: 'Gated IT park fast DC charger close to ITPL.',
      brand: 'Tata Power EZ',
      model: '60kW DC Fast',
      propertyType: 'HOTEL',
      status: 'PENDING', // PENDING APPROVAL
      street: 'ITPL Main Rd, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560066',
      latitude: 12.9850,
      longitude: 77.7340,
      pricePerHour: 120,
      pricePerKwh: 15.0,
      powerKw: 60,
      chargerType: 'DC_FAST',
      connectorType: 'CCS_2',
      operates24_7: true,
      isAvailable: true,
      amenities: ['CCTV', 'Covered Parking', 'Security Guard', 'WiFi'],
      photos: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop'],
      averageRating: 5.0,
      totalReviews: 0,
    },
  });

  console.log('✅ ChargeMitra Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
