# Invoix

> Professional invoices. Without the complexity.

Invoix is an **offline-first invoice generation and management PWA** built for SMEs, freelancers, vendors, and small business owners.

Create, customize, and download beautiful invoices — even without an internet connection.

---

## Features

- 📄 Create and manage professional invoices
- 👥 Customer directory with invoice history
- 🎨 Three invoice templates (Classic, Modern, Minimal)
- 📥 PDF download via `@react-pdf/renderer`
- 💼 Business profile with logo upload
- 📊 Dashboard with real financial metrics
- 🔌 Fully offline-capable (PWA + IndexedDB)
- 📱 Installable on desktop and mobile
- 🇳🇬 NGN default currency with multi-currency support

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Zustand | State management |
| Dexie.js + IndexedDB | Offline database |
| React Hook Form + Zod | Form validation |
| @react-pdf/renderer | PDF generation |
| vite-plugin-pwa + Workbox | Service worker / PWA |
| React Router DOM | Client-side routing |
| date-fns | Date formatting |
| Lucide React | Icons |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

---

## Project Structure

```
src/
├── components/       # Reusable UI, layout, invoice components
├── features/         # Invoice form, customer modal
├── pages/            # All route pages (landing, dashboard, invoices, etc.)
├── templates/        # Invoice templates + PDF document
├── database/         # Dexie.js schema and CRUD helpers
├── stores/           # Zustand state stores
├── hooks/            # Custom React hooks
└── utils/            # Calculations, currency, date helpers
```

---

## Deployment

The app is deployed on Vercel. `vercel.json` is configured for SPA routing.

```bash
npm run build
vercel --prod
```

---

## License

MIT
