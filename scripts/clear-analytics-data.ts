import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing dummy data for Analytics, Leads, and CS Chats...');

  // Delete all messages and conversations
  await prisma.message.deleteMany({});
  await prisma.conversationAssignment.deleteMany({});
  await prisma.aIConversationMetric.deleteMany({});
  await prisma.conversation.deleteMany({});

  // Delete all sales items and transactions
  await prisma.saleItem.deleteMany({});
  await prisma.saleTransaction.deleteMany({});

  // Delete all leads, notes, and activities
  await prisma.leadActivity.deleteMany({});
  await prisma.leadNote.deleteMany({});
  await prisma.quotationItem.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.lead.deleteMany({});
  
  // Optionally delete customers created by dummy data or guests
  await prisma.customer.deleteMany({});

  // Delete website events
  await prisma.websiteEvent.deleteMany({});

  console.log('Dummy data cleared successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
