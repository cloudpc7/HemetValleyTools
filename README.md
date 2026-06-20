# Hemet Valley Tools

**Power & Performance** — web platform for Hemet Valley Tool & Supply, serving the Inland Empire with professional-grade tool sales, equipment rentals, workshop repairs, and commercial contractor accounts.

**Live site:** [hemetvalleytools.web.app](https://hemetvalleytools.web.app)

---

## Overview

Hemet Valley Tools is a full-stack React application backed by Firebase. Customers browse products and rentals, stage orders, book equipment, submit repair intakes, and apply for commercial B2B accounts. Internal staff use a separate **Pro Portal** to manage transactions, bookings, cancellations, and operational adjustments.

| Surface | Audience | Route |
|---------|----------|-------|
| Storefront | Public customers | `/`, `/products`, `/rentals`, `/repair`, `/services`, `/checkout` |
| Pro B2B | Contractor businesses opening commercial accounts | `/b2b` |
| Pro Portal | HVT staff only (authenticated) | `/pro-login`, `/pro-portal` |

---

## Features

### Customer storefront
- Product catalog and equipment rental fleet with staging cart
- Checkout with pickup/delivery dispatch, B2B discount codes, and tax calculation
- Instant equipment reservation scheduler on the home page
- Repair ticket intake with live status tracing
- Specialty service quote requests
- Dark/light theme toggle

### Pro B2B (contractors)
- Commercial account application with Net-30 credit underwriting flow
- Blueprint and bid-spec document upload
- Trade classification, spend tiers, and onboarding milestone tracker

### Pro Portal (staff)
- Firebase Authentication with admin role enforcement
- Real-time dashboard for transactions, bookings, B2B applications, service quotes, and repair tickets
- Edit booking dates, time slots, pricing, and customer details
- Cancel bookings with automatic rental inventory restoration
- View and adjust transaction line items, fees, discounts, and totals
- Refund/cancel transactions with optional inventory restore
- Unified CRM contact view across all submission channels
- Audit logging for administrative actions

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 5, React Router 6, Redux Toolkit |
| Styling | Tailwind CSS 4, Lucide icons |
| Backend | Firebase Cloud Functions (Node 20) |
| Database | Cloud Firestore, Realtime Database |
| Auth | Firebase Authentication (staff Pro Portal) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

---

## Project structure

```
hemetvalleytools/
├── src/
│   ├── pages/           # Route-level views (Home, Products, Pro Portal, B2B, etc.)
│   ├── ui/components/   # Shared UI (Navbar, drawers, auth guards)
│   ├── redux/           # State slices (cart, catalog, auth, forms)
│   ├── config/          # Firebase client initialization
│   └── utils/           # Helpers and hooks
├── functions/           # Firebase Cloud Functions (submissions + admin APIs)
├── content/             # Catalog seed data and import scripts
├── scripts/             # Operational scripts (e.g. set-admin-claim)
├── .github/workflows/   # CI build, production deploy, PR preview
├── firebase.json        # Firebase project configuration
└── firestore.rules      # Security rules (admin-read, function-write)
```

---

## Local development

### Prerequisites
- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Access to the `hemetvalleytools` Firebase project

### Setup

```bash
git clone https://github.com/cloudpc7/HemetValleyTools.git
cd HemetValleyTools
npm ci
npm ci --prefix functions
```

### Run locally

```bash
# Frontend dev server
npm run dev

# Firebase emulators (optional)
firebase emulators:start
```

### Build

```bash
npm run build
```

Output is written to `dist/` for Firebase Hosting.

### Grant Pro Portal admin access

```bash
npm run set-admin -- team@hemetvalleytools.com
```

Requires a Firebase Auth user and Admin SDK credentials. The user must sign out and back in after the claim is set.

---

## Deployment

### Manual

```bash
npm run build
firebase deploy --only hosting,functions,firestore:rules --project hemetvalleytools
```

### Automated (GitHub Actions)

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | Every push / PR | Build verification |
| `firebase-deploy.yml` | Push to `main` | Deploy hosting, functions, and Firestore rules |
| `firebase-preview.yml` | Pull requests | Firebase Hosting preview channel (7 days) |

**Required GitHub secret:** `FIREBASE_SERVICE_ACCOUNT` — JSON key for a deploy service account with Firebase Admin permissions.

---

## Cloud Functions

Public callable functions handle customer submissions:

- `submitB2BApplication` — contractor account applications
- `submitBooking` — equipment reservations with inventory transactions
- `submitTransaction` — checkout completion
- `submitRepairTicket` / `traceRepairTicket` — workshop intake and lookup
- `submitServiceRequest` / `submitFeedback`

Staff-only admin functions (require `role: admin` custom claim):

- `adminUpdateBooking` / `adminCancelBooking`
- `adminUpdateTransaction` / `adminCancelTransaction`
- `adminUpdateLeadStatus` / `adminDeleteRecord`

---

## Contact

**Hemet Valley Tool & Supply**

777 W Esplanade Ave  
San Jacinto, CA 92582

Phone: [951-654-1034](tel:+19516541034)

---

## Contributing

Developed by [Cloud Drop Designs](https://clouddropdesigns.com).

For internal HVT staff or authorized contributors, open a pull request against `main`. PRs receive an automated build check and a Firebase Hosting preview URL.

---

## License

Private — © Hemet Valley Tool & Supply. All rights reserved.