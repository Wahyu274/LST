# Database Specification & Data Models
## LST Digital Business Platform — CV Life Solution Technology

Dokumen ini mendeskripsikan skema relasional database MySQL / Prisma ORM yang digunakan pada platform LST.

---

## 1. Relational Entity Overview

```
User (System Admin / CS / Sales Staff)
 ├── ConversationAssignment (Assigned CS chats)
 ├── Lead (Owner / Account Executive)
 ├── Project (Project Manager / PIC)
 └── AuditLog (Action actor)

Customer (Institution / Client Profile)
 ├── Lead (1-N Prospect Opportunities)
 └── Conversation (1-N Chat sessions)

Lead (CRM Opportunity Pipeline)
 ├── LeadActivity (Audit trail of stage changes)
 ├── LeadNote (Internal notes by Sales/CS)
 ├── Quotation (Official Price Quotes)
 └── Project (Converted project after WON)

Conversation (Chat Session)
 ├── Message (Visitor, AI, CS, and Internal Notes)
 └── ConversationAssignment (Assigned CS staff)

Product & Solution
 ├── ProductCategory (Hardware categories)
 ├── Product (Specifications, price, availability, showPrice toggle)
 └── ServiceSolution (8 Core LST Solutions)

Portfolio & CMS
 ├── PortfolioProject (Case studies with challenge, scope, result)
 ├── FAQ (Questions, answers, syncToAI flag)
 └── AIKnowledgeSource (Approved RAG documents)
```

---

## 2. Table Indexing & Optimization

- `User`: Unique index on `email`.
- `Product`: Unique index on `slug`. Index on `categoryId`, `availability`, `isFeatured`.
- `ServiceSolution`: Unique index on `slug`. Index on `sortOrder`.
- `PortfolioProject`: Unique index on `slug`. Index on `sector`.
- `Conversation`: Index on `status`, `visitorId`, `customerId`, `updatedAt`.
- `Message`: Index on `conversationId`, `createdAt`.
- `Lead`: Index on `stage`, `source`, `customerId`, `ownerId`.
- `AuditLog`: Index on `action`, `resource`, `userId`, `createdAt`.
