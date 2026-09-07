import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LST Digital Business Platform database...');

  // 1. Password hashing
  const adminPasswordHash = await bcrypt.hash('root@ADMIN', 10);
  const csPasswordHash = await bcrypt.hash('CSLST2026!', 10);
  const salesPasswordHash = await bcrypt.hash('SalesLST2026!', 10);
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 2. Create Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'lifesolutiont@gmail.com' },
    update: { passwordHash: adminPasswordHash, role: 'SUPER_ADMIN' },
    create: {
      email: 'lifesolutiont@gmail.com',
      name: 'Super Admin LST',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      mfaEnabled: false,
      isOnline: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lst.co.id' },
    update: { passwordHash: adminPasswordHash, role: 'SUPER_ADMIN' },
    create: {
      email: 'admin@lst.co.id',
      name: 'Siti Rahma (Operations Admin)',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      isOnline: true,
    },
  });

  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@lst.co.id' },
    update: { passwordHash: salesPasswordHash },
    create: {
      email: 'sales@lst.co.id',
      name: 'Budi Santoso (Account Executive)',
      passwordHash: salesPasswordHash,
      role: 'SALES',
      isOnline: true,
    },
  });

  const salesUser1 = await prisma.user.upsert({
    where: { email: 'sales1@lst.co.id' },
    update: { passwordHash: salesPasswordHash },
    create: {
      email: 'sales1@lst.co.id',
      name: 'Budi Santoso (Sales 1)',
      passwordHash: salesPasswordHash,
      role: 'SALES',
      isOnline: true,
    },
  });

  const csUser1 = await prisma.user.upsert({
    where: { email: 'cs1@lst.co.id' },
    update: { passwordHash: csPasswordHash },
    create: {
      email: 'cs1@lst.co.id',
      name: 'Andi Tech Support (CS Senior)',
      passwordHash: csPasswordHash,
      role: 'CUSTOMER_SERVICE',
      isOnline: true,
    },
  });

  const csUser2 = await prisma.user.upsert({
    where: { email: 'cs2@lst.co.id' },
    update: { passwordHash: csPasswordHash },
    create: {
      email: 'cs2@lst.co.id',
      name: 'Dina Customer Care (CS)',
      passwordHash: csPasswordHash,
      role: 'CUSTOMER_SERVICE',
      isOnline: true,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@lst.co.id' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      email: 'editor@lst.co.id',
      name: 'Eka Content Editor',
      passwordHash: defaultPasswordHash,
      role: 'CONTENT_EDITOR',
      isOnline: false,
    },
  });

  console.log('Created Users:', { superAdmin: superAdmin.email, cs: csUser1.email });

  // 3. Service Solutions (8 Core Solutions)
  const solutions = [
    {
      title: 'IT & Office Equipment',
      slug: 'it-office-equipment',
      iconName: 'Monitor',
      tagline: 'Perangkat komputer, laptop, server & perlengkapan kantor berkinerja tinggi.',
      problemText: 'Perusahaan & instansi sering kali kesulitan memilih spesifikasi komputer & server yang tepat serta garansi resmi yang responsif.',
      scopeText: 'Pengadaan laptop, PC Workstation, Server, UPS, Printer Multifungsi, Perangkat Kasir, & Lisensi OS/Office.',
      processText: 'Konsultasi kebutuhan > Pemilihan spesifikasi > Pengadaan > Pre-configuration > Delivery & installation.',
      sortOrder: 1,
    },
    {
      title: 'Smart Classroom & Education Technology',
      slug: 'smart-classroom',
      iconName: 'GraduationCap',
      tagline: 'Transformasi ruang kelas modern berbasis Interactive Flat Panel (IFP) & AI learning kit.',
      problemText: 'Metode pengajaran konvensional kurang interaktif & minim integrasi teknologi multimedia modern.',
      scopeText: 'Interactive Board 65"-86", Digital Podiums, Document Camera, Sound System Kelas, Studio Content Creation, LMS Integration.',
      processText: 'Survey kelas > Site planning > Hardware setup > Training guru/dosen > Ongoing support.',
      sortOrder: 2,
    },
    {
      title: 'Network & IT Infrastructure',
      slug: 'network-infrastructure',
      iconName: 'Network',
      tagline: 'Jaringan handal, fiber optic, WiFi enterprise & data center interconnections.',
      problemText: 'Koneksi lambat, jaringan tidak aman, serta minimnya manajemen bandwidth mengganggu operasional kampus & kantor.',
      scopeText: 'Kabel UTP/FO, Router Mikrotik/Cisco, Managed Switches, Enterprise Access Point WiFi 6, Firewall & Rack Cabinet.',
      processText: 'Network Audit > Topology Design > Wiring & Installation > Bandwidth Management & VLAN Setup > Penetration Testing.',
      sortOrder: 3,
    },
    {
      title: 'CCTV & Security Solutions',
      slug: 'cCTV-security',
      iconName: 'ShieldCheck',
      tagline: 'Sistem pengawasan pintar 24/7 dengan AI face recognition & access control.',
      problemText: 'Keamanan fisik aset perusahaan dan pengawasan lingkungan institusi yang belum terintegrasi.',
      scopeText: 'IP Camera 4K Night Vision, NVR Storage Enterprise, Face Recognition Access Control, Automatic Barrier Gate.',
      processText: 'Site Survey > Angle Planning > Cable Installation > NVR Configuration > Mobile Remote Access Setup.',
      sortOrder: 4,
    },
    {
      title: 'System & Software Solutions',
      slug: 'system-software',
      iconName: 'Code',
      tagline: 'Pengembangan software kustom, Web App, Mobile App, & sistem ERP/Akademik.',
      problemText: 'Proses bisnis manual yang lambat dan data antar departemen yang terisolasi (siloed data).',
      scopeText: 'Sistem Informasi Sekolah/Kampus, ERP Perusahaan, Portal Customer, Mobile App Android/iOS, Integration API.',
      processText: 'Requirement Gathering > UI/UX Design > Agile Development > Testing & QA > Deployment & Cloud Hosting.',
      sortOrder: 5,
    },
    {
      title: 'AI & Digital Learning',
      slug: 'ai-digital-learning',
      iconName: 'Cpu',
      tagline: 'Implementasi platform pembelajaran berbasis AI & asisten kecerdasan buatan institusi.',
      problemText: 'Kurangnya kesiapan institusi dalam mengadopsi teknologi AI untuk efisiensi dan personalisasi pembelajaran.',
      scopeText: 'AI Tutor Assistant, Automated Grading Systems, AI Ethics Training, Generative AI Workflow Integration.',
      processText: 'Assessment > AI Model Adaptation > Knowledge Base Training > Pilot Program > Full Rollout.',
      sortOrder: 6,
    },
    {
      title: 'IT Consulting & System Integration',
      slug: 'it-consulting',
      iconName: 'Briefcase',
      tagline: 'Pendampingan strategi digital transformation, audit IT & arsitektur sistem.',
      problemText: 'Investasi teknologi yang tidak efisien akibat tidak adanya roadmap digital transformation yang matang.',
      scopeText: 'Digital Blueprinting, IT Audit, Feasibility Study, Vendor Evaluation, Infrastructure Assessment.',
      processText: 'Discovery > Gap Analysis > Blueprint Recommendation > Vendor Sourcing Assistance > Project Governance.',
      sortOrder: 7,
    },
    {
      title: 'Maintenance & Technical Support',
      slug: 'maintenance-support',
      iconName: 'Wrench',
      tagline: 'Layanan pemeliharaan berkala, troubleshooting cepat, & garansi purna jual terjamin.',
      problemText: 'Downtime perangkat yang merugikan operasional dan lambatnya respon garansi supplier biasa.',
      scopeText: 'SLA Maintenance Contract, On-Site Technician Support, Hardware Replacement Warranty, Preventive Cleaning.',
      processText: 'SLA Definition > Periodic Preventive Inspection > Emergency On-Call Support > Monthly Reports.',
      sortOrder: 8,
    },
  ];

  for (const sol of solutions) {
    await prisma.serviceSolution.upsert({
      where: { slug: sol.slug },
      update: sol,
      create: sol,
    });
  }

  // 4. Product Categories & Products
  const catEdu = await prisma.productCategory.upsert({
    where: { slug: 'smart-education' },
    update: {},
    create: { name: 'Smart Education', slug: 'smart-education', description: 'Perangkat interaktif untuk sekolah dan kampus' },
  });

  const catNet = await prisma.productCategory.upsert({
    where: { slug: 'networking-server' },
    update: {},
    create: { name: 'Networking & Server', slug: 'networking-server', description: 'Router, Switch, Server & Racks' },
  });

  const catSec = await prisma.productCategory.upsert({
    where: { slug: 'cctv-security' },
    update: {},
    create: { name: 'CCTV & Security', slug: 'cctv-security', description: 'IP Camera 4K & Access Control' },
  });

  await prisma.product.upsert({
    where: { slug: 'interactive-flat-panel-75' },
    update: {},
    create: {
      categoryId: catEdu.id,
      name: 'Interactive Flat Panel (IFP) 75 Inch 4K 40-Touch',
      slug: 'interactive-flat-panel-75',
      brand: 'LST SmartBoard',
      specifications: 'Display: 75" 4K UHD, OS: Android 13 + Windows 11 Dual OS, Touch: 40-point Infrared, RAM: 8GB, Storage: 128GB, Camera: 4K Built-in 8 Mic Array.',
      description: 'Papan tulis interaktif kelas dunia untuk perkuliahan dan presentasi eksekutif. Mendukung screen mirror simultan hingga 9 perangkat.',
      price: 48500000,
      showPrice: true,
      availability: 'IN_STOCK',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.product.upsert({
    where: { slug: 'lst-rack-server-2u' },
    update: {},
    create: {
      categoryId: catNet.id,
      name: 'LST High-Performance 2U Rack Server Dual Xeon',
      slug: 'lst-rack-server-2u',
      brand: 'LST Enterprise',
      specifications: 'CPU: Dual Intel Xeon Silver 4314, RAM: 128GB DDR4 ECC, Storage: 4x 1.92TB NVMe SSD Enterprise RAID 10, Redundant PSU 800W.',
      description: 'Server performa tinggi untuk database sekolah, LMS, dan aplikasi ERP lokal institusi.',
      price: 65000000,
      showPrice: false,
      availability: 'BY_REQUEST',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.product.upsert({
    where: { slug: 'ai-cctv-4k-security-kit' },
    update: {},
    create: {
      categoryId: catSec.id,
      name: 'Enterprise AI CCTV 4K System (16 Camera + 32CH NVR)',
      slug: 'ai-cctv-4k-security-kit',
      brand: 'LST Guard',
      specifications: 'Camera: 16x 8MP 4K IP Dome/Bullet, NVR: 32 Channel 4 SATA NVR, Storage: 2x 8TB Surveillance HDD, Smart AI Face & Vehicle Detection.',
      description: 'Paket sistem pengawasan canggih untuk area kampus dan gedung perkantoran.',
      price: 32000000,
      showPrice: true,
      availability: 'IN_STOCK',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    },
  });

  // 5. FAQ Categories & FAQs
  const faqGen = await prisma.fAQCategory.upsert({
    where: { slug: 'general' },
    update: {},
    create: { name: 'Umum & Wilayah Layanan', slug: 'general', sortOrder: 1 },
  });

  const faqProc = await prisma.fAQCategory.upsert({
    where: { slug: 'procurement' },
    update: {},
    create: { name: 'Pengadaan & Penawaran', slug: 'procurement', sortOrder: 2 },
  });

  const faqTech = await prisma.fAQCategory.upsert({
    where: { slug: 'technical' },
    update: {},
    create: { name: 'Instalasi & Garansi', slug: 'technical', sortOrder: 3 },
  });

  await prisma.fAQ.createMany({
    data: [
      {
        categoryId: faqGen.id,
        question: 'Dimanakah area cakupan layanan CV Life Solution Technology (LST)?',
        answer: 'Kantor pusat kami berlokasi di Temanggung, Jawa Tengah. Kami melayani pengadaan, instalasi, dan support untuk seluruh wilayah Jawa Tengah, DI Yogyakarta, dan pengadaan nasional untuk instansi/sekolah.',
        isPublished: true,
        syncToAI: true,
        sortOrder: 1,
      },
      {
        categoryId: faqProc.id,
        question: 'Bagaimana alur permintaan Surat Penawaran Harga (Quotation) resmi?',
        answer: 'Anda dapat menekan tombol "Minta Penawaran" pada detail produk/solusi, berkonsultasi via AI Assistant, atau langsung menghubungi tim sales kami melalui WhatsApp (0821-3555-0007). Tim kami akan menerbitkan dokumen PDF penawaran resmi lengkap dengan spesifikasi & legalitas.',
        isPublished: true,
        syncToAI: true,
        sortOrder: 2,
      },
      {
        categoryId: faqTech.id,
        question: 'Bagaimana ketentuan garansi purna jual dan teknisi on-site LST?',
        answer: 'Setiap perangkat keras mendapatkan garansi resmi distributor 1-3 tahun. Untuk layanan pemeliharaan institusi, kami menyediakan garansi teknisi on-site dengan SLA respon maksimal 1x24 jam.',
        isPublished: true,
        syncToAI: true,
        sortOrder: 3,
      },
    ],
  });

  // 6. Portfolio Projects
  const portfolio1 = await prisma.portfolioProject.upsert({
    where: { slug: 'smart-classroom-smkn-1-temanggung' },
    update: {},
    create: {
      title: 'Implementasi 12 Ruang Kelas Smart Classroom SMKN 1 Temanggung',
      slug: 'smart-classroom-smkn-1-temanggung',
      sector: 'Education',
      location: 'Temanggung, Jawa Tengah',
      solutionType: 'Smart Classroom & High-Speed Network',
      challengeText: 'Sekolah membutuhkan modernisasi ruang teori dan laboratorium multimedia agar pembelajaran dapat diakses interaktif dan mendukung hybrid learning.',
      scopeText: 'Pemasangan 12 Unit Interactive Flat Panel 75", Jaringan Fiber Optic Antar Gedung, Enterprise Access Point WiFi 6, dan Pelatihan 45 Guru.',
      resultText: 'Peningkatan efisiensi penyampaian materi hingga 40%, tingkat partisipasi siswa meningkat drastis, dan ruang laboratorium terhubung sempurna.',
      coverImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
    },
  });

  // 7. Customers & Leads & Conversations (Seed data for CRM & CS Workspace demo)
  const cust1 = await prisma.customer.create({
    data: {
      name: 'Dr. Hendra Wijaya',
      institution: 'SMA Negeri 2 Magelang',
      phone: '081234567890',
      email: 'hendra@sman2magelang.sch.id',
      location: 'Magelang',
      notes: 'Berminat pada paket Smart Classroom 6 kelas.',
    },
  });

  const lead1 = await prisma.lead.create({
    data: {
      customerId: cust1.id,
      ownerId: salesUser.id,
      source: 'AI_CHAT',
      interest: 'Smart Classroom IFP 75 Inch (6 Unit)',
      stage: 'QUOTATION',
      estimatedValue: 290000000,
      notes: 'Sudah dikirimkan draft penawaran via WhatsApp & email.',
    },
  });

  await prisma.leadActivity.create({
    data: {
      leadId: lead1.id,
      type: 'STAGE_CHANGE',
      title: 'Lead Stage Updated to QUOTATION',
      details: 'Sent official quotation PDF for 6 units of IFP 75 Inch.',
      actorName: 'Budi Santoso (Sales)',
    },
  });

  const conv1 = await prisma.conversation.create({
    data: {
      customerId: cust1.id,
      visitorId: 'visitor-session-88392',
      status: 'WAITING_FOR_CS',
      intentCategory: 'Smart Classroom',
      summary: 'Klien dari SMA Negeri 2 Magelang ingin konsultasi spesifikasi teknis instalasi Interactive Board dan dukungan jaringan LAN sekolah.',
      unreadCS: true,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderType: 'VISITOR',
        senderName: 'Dr. Hendra Wijaya',
        content: 'Halo LST, apakah paket Smart Classroom sudah termasuk instalasi kabel LAN dan bracket dinding?',
      },
      {
        conversationId: conv1.id,
        senderType: 'AI',
        senderName: 'LST Virtual Consultant',
        content: 'Halo Dr. Hendra! Ya, paket Smart Classroom LST sudah mencakup heavy-duty wall bracket, kabel HDMI/LAN, dan instalasi profesional oleh teknisi certified kami. Apakah Anda ingin berbicara dengan Customer Service untuk penjadwalan survey lokasi?',
      },
      {
        conversationId: conv1.id,
        senderType: 'VISITOR',
        senderName: 'Dr. Hendra Wijaya',
        content: 'Ya tolong sambungkan dengan Customer Service.',
      },
    ],
  });

  // 8. Sample Sales Transactions
  await prisma.saleTransaction.upsert({
    where: { code: 'INV-2026-0801' },
    update: {},
    create: {
      code: 'INV-2026-0801',
      clientName: 'Universitas Dian Nuswantoro',
      category: 'Smart Education',
      totalRevenue: 145000000,
      saleDate: new Date('2026-08-01'),
    },
  });

  await prisma.saleTransaction.upsert({
    where: { code: 'INV-2026-0805' },
    update: {},
    create: {
      code: 'INV-2026-0805',
      clientName: 'PT Nusantara Agro Industri',
      category: 'CCTV & Security',
      totalRevenue: 84000000,
      saleDate: new Date('2026-08-05'),
    },
  });

  // 9. Partner Logos Seeding
  const partnerLogos = [
    { name: 'Kementerian Pendidikan & Kebudayaan', logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80', category: 'INSTITUTION', sortOrder: 1 },
    { name: 'Dinas Komunikasi & Informatika', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80', category: 'INSTITUTION', sortOrder: 2 },
    { name: 'PT Telkom Indonesia (Persero)', logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80', category: 'PARTNER', sortOrder: 3 },
    { name: 'Universitas Gadjah Mada', logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80', category: 'CLIENT', sortOrder: 4 },
    { name: 'Politeknik Negeri Semarang', logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80', category: 'CLIENT', sortOrder: 5 },
    { name: 'Pemerintah Kabupaten Temanggung', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80', category: 'INSTITUTION', sortOrder: 6 },
  ];

  for (const partner of partnerLogos) {
    const existing = await (prisma as any).partnerLogo.findFirst({ where: { name: partner.name } });
    if (!existing) {
      await (prisma as any).partnerLogo.create({ data: partner });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
