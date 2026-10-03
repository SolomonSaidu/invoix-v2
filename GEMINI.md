# Invoix — Project Instructions

## 1. Project Identity

**Project name:** Invoix  
**Product type:** Offline-first invoice generation and management PWA  
**Target audience:** SMEs, freelancers, vendors, entrepreneurs, and small business owners.

Invoix helps non-technical business owners create, customize, download, and manage professional invoices without complicated accounting software.

### Core product philosophy

Creating an invoice should feel as easy as filling out a simple form, not operating accounting software.

Always prioritize:

1. Simplicity.
2. Excellent user experience.
3. Reliability.
4. Offline functionality.
5. Professional visual design.
6. Maintainable code.

Do not introduce unnecessary complexity.

---

## 2. Technology Stack

Use:

- React
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- Dexie.js
- IndexedDB
- vite-plugin-pwa
- Workbox
- React Hook Form
- Zod
- Lucide React
- @react-pdf/renderer
- date-fns

Use additional dependencies only when necessary.

Do not introduce a backend into the initial MVP.

Do not use TypeScript unless explicitly requested.

---

## 3. Application Architecture

Organize the application using a feature-based architecture.

Separate:

- Pages
- Reusable UI components
- Business logic
- Database operations
- State management
- Validation
- Invoice calculations
- PDF generation
- PWA configuration

Keep components focused and reusable.

Avoid giant components containing unrelated logic.

Do not place all application logic inside App.jsx.

Suggested structure:

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── common/
│   └── invoice/
├── pages/
├── features/
│   ├── invoices/
│   ├── customers/
│   ├── business/
│   └── dashboard/
├── database/
├── hooks/
├── stores/
├── utils/
├── templates/
├── App.jsx
├── main.jsx
└── index.css
```

Adapt the structure when necessary, but maintain clear separation of concerns.

---

## 4. Product Requirements

### Homepage

Create a polished, professional SaaS landing page.

Hero headline:

"Professional invoices. Without the complexity."

Supporting text:

"Create, customize, and download beautiful invoices for your business — even without an internet connection."

The navigation must contain:

- Invoix logo
- Features
- How it works
- Download App button

The Download App button must trigger PWA installation where supported.

Use the beforeinstallprompt event and provide installation instructions when native installation is unavailable.

The hero section must also contain:

- Create your first invoice CTA
- See how it works CTA
- Professional product preview

Other sections:

- Features
- How it works
- Offline functionality
- FAQ
- Footer

### Application Navigation

Create a separate application interface.

Navigation:

- Overview
- Invoices
- Customers
- Create Invoice
- Business Profile
- Settings

Use a sidebar on desktop and appropriate mobile navigation.

### Dashboard

Display:

- Total invoiced
- Total paid
- Outstanding invoices
- Total customers
- Recent invoices
- Create invoice shortcut

Calculate statistics from actual local records.

Never use fake financial statistics.

### Business Profile

Allow users to configure:

- Business name
- Logo
- Email
- Phone
- Address
- Tax ID (optional)
- Registration number (optional)
- Default currency

Logo images must persist using IndexedDB.

### Customers

Implement:

- Add customer
- Edit customer
- Delete customer
- Search customers
- View customer details
- Select saved customers during invoice creation

### Invoice Creation

Create a simple form with:

**Business information**
Automatically populate from the business profile.

**Customer information**
Select an existing customer or enter new details.

**Invoice details**

- Automatically generated invoice number
- Invoice date
- Due date
- Currency
- Status

**Items**

- Description
- Quantity
- Unit price
- Amount

Allow adding and removing items.

Automatically calculate:

- Subtotal
- Discount
- Tax
- Total

Discount and tax must be optional.

**Additional information**

- Notes
- Payment instructions
- Terms and conditions

Provide a live invoice preview.

Required information should be kept to a minimum.

A user should be able to generate an invoice using only customer name, item description, quantity, and price, alongside the business profile information.

### Invoice Management

Implement:

- View invoices
- Search
- Filter by status
- Filter by date
- View invoice details
- Edit
- Delete with confirmation
- Download PDF
- Print
- Mark as paid

Statuses:

- DRAFT
- UNPAID
- PAID
- OVERDUE

Determine overdue status using due date and payment status.

Preserve historical invoice snapshots when customer or business information changes.

### Invoice Templates

Create three templates:

1. Classic
2. Modern
3. Minimal

Support:

- Business logo
- Business information
- Customer information
- Invoice number
- Dates
- Items
- Subtotal
- Discount
- Tax
- Total
- A4 formatting

Allow template and accent-color selection.

PDFs must not have overlapping text or broken layouts.

### Settings

Include:

- Default currency
- Invoice numbering prefix
- Default template
- Accent color
- Data export
- Clear application data with confirmation

---

## 5. Offline-First Requirements

Offline functionality is mandatory.

Use:

- Service Worker
- IndexedDB
- Dexie.js
- PWA manifest
- vite-plugin-pwa

The application must support:

- Opening after installation without internet
- Creating invoices offline
- Editing invoices offline
- Saving customers offline
- Uploading logos offline
- Viewing previous invoices offline
- Generating PDFs offline

Do not rely on localStorage as the primary database.

Store uploaded images as Blobs in IndexedDB.

Ensure the application shell is cached.

Display a subtle online/offline indicator.

Do not implement cloud synchronization in the MVP.

Design the data layer so future synchronization can be introduced without rewriting the UI.

---

## 6. Data Integrity

Follow these rules:

- Every record must have a unique ID.
- Use createdAt and updatedAt timestamps.
- Invoice numbers must be unique.
- Validate required fields.
- Prevent negative quantities and prices.
- Avoid floating-point monetary calculation errors.
- Preserve invoice snapshots.
- Do not accidentally delete invoices when deleting customers.
- Confirm destructive operations.
- Ensure saved records survive application restarts.
- Ensure uploaded logos remain available after refreshing.

Use integer minor currency units or an equivalent reliable monetary calculation approach.

Keep invoice calculation logic in reusable utility functions.

The invoice form, dashboard, and PDF must use consistent calculations.

---

## 7. UI/UX Design System

Visual direction:

- Modern
- Minimal
- Professional
- Premium
- Friendly
- Accessible

Preferred design:

- White and light grey backgrounds
- Deep indigo/violet accent
- Subtle borders
- Soft shadows
- Rounded corners
- Consistent spacing
- Inter or Geist typography
- Lucide icons

Avoid:

- Excessive gradients
- Unnecessary animations
- Cluttered layouts
- Too many cards
- Tiny text
- Overcomplicated forms
- Decorative buttons that do nothing

Use familiar language suitable for non-technical users.

Examples:

Use "Customers" instead of "Client Management".

Use "Unpaid invoices" instead of "Accounts Receivable".

Use "Business Profile" instead of "Organization Configuration".

Every primary action must be understandable without technical knowledge.

Implement proper:

- Loading states
- Empty states
- Error states
- Success feedback
- Focus states
- Disabled states
- Confirmation dialogs

Ensure responsive layouts across desktop, tablet, and mobile.

---

## 8. First-Time Experience

On first launch, display:

"Let's set up your business."

Ask for:

- Business name
- Logo (optional)
- Phone number
- Address (optional)

After setup, navigate to the dashboard.

Do not require registration or authentication in the MVP.

Do not overwhelm new users with unnecessary onboarding.

---

## 9. Engineering Standards

Before implementing a feature:

1. Inspect the existing project structure.
2. Understand existing components and logic.
3. Identify affected files.
4. Explain the implementation approach when the task is substantial.
5. Implement using the existing architecture.
6. Test the functionality.
7. Report what changed.

Do not rewrite working code without a clear reason.

Do not duplicate existing functionality.

Do not introduce dependencies without justification.

Use descriptive variable and function names.

Keep functions focused.

Handle errors explicitly.

Avoid unnecessary comments that merely explain obvious code.

Do not use mock functionality as a replacement for real implementation.

Never claim a feature works without verifying it.

Do not leave primary buttons non-functional.

If something cannot be implemented, explain why.

---

## 10. Development Phases

Build Invoix incrementally.

### Phase 1 — Foundation

- Project setup
- Tailwind configuration
- Design system
- Homepage
- Application layout
- Navigation
- Dashboard

### Phase 2 — Core Features

- Business profile
- Logo upload
- Customer management
- Invoice creation
- Calculations
- Invoice management

### Phase 3 — Invoice Generation

- Three templates
- Live preview
- PDF generation
- Printing

### Phase 4 — Offline Functionality

- IndexedDB
- Dexie.js
- Service Worker
- PWA installation
- Offline testing
- Data persistence

### Phase 5 — Polish

- Responsive testing
- Accessibility
- Error handling
- Data export
- Performance
- Bug fixing

Do not skip ahead without completing and verifying the current phase.

---

## 11. Important Development Rules

- Work on one phase or clearly defined feature at a time.
- Do not generate the entire application in one enormous response.
- Do not change the agreed technology stack without discussing the reason.
- Do not introduce authentication unless requested.
- Do not introduce a backend into the MVP.
- Do not hardcode tax rates.
- Default currency should be NGN.
- Support other currencies.
- Payment instructions should be customizable.
- Support Nigerian business details without restricting international users.
- Do not build accounting, inventory, payroll, or payment gateway features into the MVP.

---

## 12. Current Development Objective

Always check the current project state before starting a task.

If the project is empty, begin with Phase 1.

If Phase 1 is already complete, continue from the next incomplete phase.

Never assume a feature has been implemented merely because it appears in this instruction file.

### Final Product Standard

Invoix must feel like a real commercial product.

Prioritize:

- User experience
- Reliability
- Offline functionality
- Data integrity
- Professional design
- Maintainable architecture

The final experience should make a non-technical business owner comfortable using the application without needing a tutorial.
