# Dance Space Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready booking flow for dance hall «ЗАЛ» with cleaned design/content, new Firebase configuration, paid bookings through YooKassa, SMTP email notifications, legal consent checkboxes, and a protected `/admin` area.

**Architecture:** Keep the public site as Vite + React + TypeScript + Tailwind + HeroUI. Add a separate `server/` Express backend for future VPS deployment; the backend owns YooKassa secrets, SMTP credentials, Firebase Admin access, payment webhooks, and critical admin operations. Firestore stores bookings, blocked slots, payment events, and admin metadata; Firebase Auth protects `/admin`.

**Tech Stack:** React 18, Vite 6, TypeScript, HeroUI, Tailwind, Firebase Web SDK, Firebase Admin SDK, Express, Nodemailer, YooKassa REST API via `fetch`, Node.js 20+.

---

## Scope Split

This specification contains four connected subsystems. Implement in this order so every phase leaves the site usable:

1. Frontend cleanup and visual refresh.
2. Shared booking domain model and Firebase client config.
3. Server skeleton, payment, email, and Firestore writes.
4. Admin authentication and booking management.

The current working folder is `/Users/matvejvoroncov/Downloads/lookbeta1/dance-space-zal2`. It is not a Git repository, so replace commit steps with local verification until Git is initialized.

---

## File Structure

### Frontend files to modify

- `index.html` — site title and legacy third-party script cleanup.
- `src/index.css` — soft motion background, base legal/admin styles, legacy class cleanup.
- `src/App.tsx` — lightweight route switch for public pages and `/admin`, `/privacy`, `/terms`, `/payment-status`.
- `src/firebase.ts` — Firebase config from Vite env, Auth export, Firestore export.
- `src/context/BookingContext.tsx` — keep shared selected date, slots, booking type.
- `src/hooks/use-booking-store.ts` — replace mock/localStorage source of truth with Firestore-backed booking availability.
- `src/components/booking-calendar.tsx` — remove console noise, use confirmed bookings/blocked slots.
- `src/components/booking-time-slots.tsx` — use shared price utilities and Firestore availability.
- `src/components/booking-form.tsx` — replace direct Firestore/EmailJS with backend payment creation and required consent checkboxes.
- `src/components/header.tsx` — add admin link only as subtle footer/admin path if needed, keep public nav clean.
- `src/components/hero.tsx` — apply variant A visual refresh and real hall wording.
- `src/components/pricing-section.tsx` — align prices with booking price calculation.
- `src/components/footer.tsx` — add privacy/terms links and remove photo-studio remnants.
- `src/components/gallery-section.tsx` — either remove from imports or rewrite as hall draft content when later used.
- `src/components/equipment-section.tsx` — leave unimported or remove after confirming no import remains.

### Frontend files to create

- `src/lib/booking-types.ts` — shared frontend booking types.
- `src/lib/pricing.ts` — deterministic slot pricing.
- `src/lib/api.ts` — typed calls to backend API.
- `src/lib/local-bookings.ts` — local browser ownership marker for “Ваше бронирование”.
- `src/pages/AdminPage.tsx` — protected admin shell.
- `src/pages/AdminLoginPage.tsx` — Firebase Auth email/password login.
- `src/pages/PrivacyPage.tsx` — personal data policy starter text.
- `src/pages/TermsPage.tsx` — rental/payment/cancellation terms starter text.
- `src/pages/PaymentStatusPage.tsx` — return page after YooKassa payment.
- `src/components/admin/admin-bookings-table.tsx` — booking list and status badges.
- `src/components/admin/admin-block-slots-form.tsx` — manual slot blocking.
- `src/components/admin/admin-auth-guard.tsx` — auth gate for `/admin`.

### Server files to create

- `server/package.json` — backend scripts and dependencies.
- `server/tsconfig.json` — server TypeScript config.
- `server/src/index.ts` — Express app setup and route mounting.
- `server/src/env.ts` — required env validation.
- `server/src/firebase-admin.ts` — Firebase Admin initialization.
- `server/src/pricing.ts` — server-side copy of pricing logic.
- `server/src/bookings-repo.ts` — Firestore reads/writes for bookings and blocked slots.
- `server/src/yookassa.ts` — YooKassa REST client using Basic auth and idempotence keys.
- `server/src/mailer.ts` — Nodemailer SMTP transport and email templates.
- `server/src/auth.ts` — Firebase ID token verification and admin role check.
- `server/src/routes/public.ts` — public health, create payment, payment status routes.
- `server/src/routes/webhooks.ts` — YooKassa webhook route.
- `server/src/routes/admin.ts` — cancel booking and block/unblock slots.
- `server/.env.example` — documented server variables.

### Config/docs files to create or modify

- `.env.example` — Vite frontend Firebase/backend URL variables.
- `firestore.rules` — client-readable public availability and admin-only protected writes.
- `docs/setup/firebase.md` — step-by-step new Firebase setup.
- `docs/setup/yookassa.md` — test shop, webhook, env variables.
- `docs/setup/email.md` — Gmail App Password and future domain SMTP setup.
- `docs/setup/vps.md` — Node, PM2, Nginx, HTTPS deployment outline.

---

## Task 1: Clean Branding and Static Content

**Files:**
- Modify: `index.html`
- Modify: `src/components/header.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/components/hero.tsx`
- Modify: `src/components/gallery-section.tsx`
- Modify: `src/components/equipment-section.tsx`

- [ ] **Step 1: Search for stale photography content**

Run:

```bash
rg -n "Фотостудия|Look|фотостуд|фото|съем|съём|studio|equipment|template_py0xfha|service_3zzdh6a|lookbook" src index.html docs package.json
```

Expected: matches are only in files targeted by this task and the old design spec.

- [ ] **Step 2: Update `index.html` metadata**

Set:

```html
<title>Танцевальный зал ЗАЛ — аренда зала в Ярославле</title>
<meta name="description" content="Светлый танцевальный зал 100 м² для репетиций, тренировок и занятий. Онлайн-бронирование, удобное расписание и оплата." />
```

Remove the two legacy HeroUI chat script tags unless visual editing tooling still needs them locally.

- [ ] **Step 3: Remove unused imports from public app flow**

Ensure `src/App.tsx` imports only active sections. `GallerySection` and `EquipmentSection` must not be imported unless rewritten for hall content.

- [ ] **Step 4: Rewrite stale public labels**

Use these replacements consistently:

```text
Фотостудия Look -> Танцевальный зал ЗАЛ
студия -> зал
съемка/съёмка -> занятие/репетиция
оборудование для фото -> удобства зала
Забронировать студию -> Забронировать зал
```

- [ ] **Step 5: Verify stale content is gone**

Run:

```bash
rg -n "Фотостудия|Look|фотостуд|фото|съем|съём|Забронировать студию|Наша студия" src index.html
```

Expected: no matches.

---

## Task 2: Apply Variant A Visual Refresh

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`
- Modify: `src/components/hero.tsx`

- [ ] **Step 1: Add soft motion background tokens**

In `src/index.css`, use a body background that keeps the current palette:

```css
body {
  @apply bg-background text-foreground m-0 p-0 min-h-screen;
  background:
    radial-gradient(circle at 12% 18%, rgba(93, 107, 78, 0.13), transparent 28%),
    radial-gradient(circle at 82% 12%, rgba(185, 155, 125, 0.18), transparent 30%),
    radial-gradient(circle at 50% 80%, rgba(213, 195, 177, 0.16), transparent 34%),
    linear-gradient(135deg, #faf9f7 0%, #f5f1eb 48%, #fbfaf8 100%);
}

.motion-grid-bg {
  position: relative;
  overflow: hidden;
}

.motion-grid-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(93, 107, 78, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(93, 107, 78, 0.06) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at 50% 30%, black, transparent 76%);
}
```

- [ ] **Step 2: Add hero decorative curves**

In `src/components/hero.tsx`, add an absolutely positioned SVG curve layer inside the hero background. Use low-opacity strokes with `primary` and `secondary` colors.

- [ ] **Step 3: Keep accessibility readable**

Check hero text contrast visually. Hero text remains `text-foreground`, paragraph remains no lighter than `text-foreground-500` if the background gets brighter.

- [ ] **Step 4: Verify visually**

Run dev server and open `http://127.0.0.1:5173/`. Expected: same layout, richer background, no strong neon or dark theme.

---

## Task 3: Add Shared Booking Types and Pricing

**Files:**
- Create: `src/lib/booking-types.ts`
- Create: `src/lib/pricing.ts`
- Create: `server/src/pricing.ts` later mirrors this logic
- Modify: `src/components/booking-time-slots.tsx`
- Modify: `src/components/booking-form.tsx`
- Modify: `src/components/pricing-section.tsx`

- [ ] **Step 1: Create frontend booking types**

Create `src/lib/booking-types.ts`:

```ts
export type BookingType = 'individual' | 'group';
export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'expired';

export interface PublicBooking {
  id: string;
  date: string;
  timeSlots: string[];
  bookingType: BookingType;
  status: BookingStatus;
  totalPrice: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  paymentId?: string;
  createdAt?: unknown;
  confirmedAt?: unknown;
  cancelledAt?: unknown;
  cancelReason?: string;
  source?: 'public' | 'admin_manual';
}

export interface BlockedSlot {
  id: string;
  date: string;
  timeSlots: string[];
  reason: string;
  active: boolean;
  createdAt?: unknown;
  createdBy?: string;
}
```

- [ ] **Step 2: Create pricing utility**

Create `src/lib/pricing.ts`:

```ts
import type { BookingType } from './booking-types';

export const createHourlySlots = (startHour = 10, endHour = 20) =>
  Array.from({ length: endHour - startHour }, (_, index) => {
    const hour = startHour + index;
    return { id: `${hour}:00`, time: `${hour}:00`, hour };
  });

export const isWeekendDate = (date: string) => {
  const value = new Date(`${date}T00:00:00`);
  const day = value.getDay();
  return day === 0 || day === 6;
};

export const getSlotPrice = (date: string, hour: number, bookingType: BookingType) => {
  if (isWeekendDate(date)) return 1000;
  if (bookingType === 'individual') return hour < 17 ? 600 : 800;
  return hour < 17 ? 1000 : 1400;
};

export const getTotalPrice = (date: string, slots: string[], bookingType: BookingType) =>
  slots.reduce((sum, slot) => sum + getSlotPrice(date, Number.parseInt(slot, 10), bookingType), 0);
```

- [ ] **Step 3: Replace duplicated pricing code**

Use `createHourlySlots`, `getSlotPrice`, and `getTotalPrice` in booking slots, booking form, and pricing display helper text.

- [ ] **Step 4: Verify price consistency**

Manual cases:

```text
Weekday individual 10:00 -> 600
Weekday individual 17:00 -> 800
Weekday group 10:00 -> 1000
Weekday group 17:00 -> 1400
Weekend any type 10:00 -> 1000
```

---

## Task 4: Configure New Firebase Client Through Env

**Files:**
- Modify: `src/firebase.ts`
- Create: `.env.example`
- Create: `docs/setup/firebase.md`
- Create: `firestore.rules`

- [ ] **Step 1: Replace hard-coded Firebase config**

Use Vite env variables in `src/firebase.ts`:

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
for (const key of requiredConfig) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing Firebase config: ${key}`);
  }
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

- [ ] **Step 2: Add `.env.example`**

Create:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_BASE_URL=http://localhost:8787
```

- [ ] **Step 3: Add initial Firestore rules**

Create `firestore.rules`:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid))
        && get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'admin';
    }

    match /bookings/{bookingId} {
      allow read: if true;
      allow create, update, delete: if false;
    }

    match /blockedSlots/{blockedSlotId} {
      allow read: if true;
      allow create, update, delete: if false;
    }

    match /paymentEvents/{eventId} {
      allow read, write: if false;
    }

    match /adminUsers/{userId} {
      allow read: if isAdmin() && request.auth.uid == userId;
      allow write: if false;
    }
  }
}
```

- [ ] **Step 4: Write Firebase setup doc**

Create `docs/setup/firebase.md` with exact steps: create Firebase project, create Web app, copy config to `.env`, enable Firestore, enable Email/Password provider in Authentication, create admin user, create `adminUsers/{uid}` document with `{ email, role: 'admin' }`, publish rules.

---

## Task 5: Replace Local Mock Booking Store With Firestore Availability

**Files:**
- Modify: `src/hooks/use-booking-store.ts`
- Modify: `src/components/booking-calendar.tsx`
- Modify: `src/components/booking-time-slots.tsx`
- Create: `src/lib/local-bookings.ts`

- [ ] **Step 1: Create local ownership helper**

Create `src/lib/local-bookings.ts`:

```ts
const STORAGE_KEY = 'zal_booking_ids';

export const getLocalBookingIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const rememberLocalBookingId = (bookingId: string) => {
  const ids = new Set(getLocalBookingIds());
  ids.add(bookingId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

export const isLocalBooking = (bookingId: string) => getLocalBookingIds().includes(bookingId);
```

- [ ] **Step 2: Read confirmed bookings and active blocked slots**

Update hook to subscribe to Firestore collections and return:

```ts
{
  bookings: PublicBooking[];
  blockedSlots: BlockedSlot[];
  isLoading: boolean;
  error: string | null;
}
```

Only `confirmed` bookings block public slots. `pending_payment` is not shown as confirmed to users until backend confirms it.

- [ ] **Step 3: Calendar date status**

A date is partially occupied if any confirmed booking or active blocked slot contains that date. It is “your booking” if a confirmed booking id exists in `zal_booking_ids`.

- [ ] **Step 4: Slot status**

A slot is disabled if it appears in a confirmed booking or active blocked slot for the selected date.

---

## Task 6: Add Consent Checkboxes and Payment Start Form

**Files:**
- Modify: `src/components/booking-form.tsx`
- Create: `src/lib/api.ts`
- Create: `src/pages/PrivacyPage.tsx`
- Create: `src/pages/TermsPage.tsx`

- [ ] **Step 1: Create API helper**

Create `src/lib/api.ts`:

```ts
import type { BookingType } from './booking-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

export interface CreatePaymentPayload {
  date: string;
  timeSlots: string[];
  bookingType: BookingType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  consents: {
    personalData: boolean;
    rentalRules: boolean;
    paymentTerms: boolean;
    contactsAreCorrect: boolean;
  };
}

export interface CreatePaymentResponse {
  bookingId: string;
  confirmationUrl: string;
}

export const createPayment = async (payload: CreatePaymentPayload): Promise<CreatePaymentResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Не удалось создать платеж');
  }

  return response.json();
};
```

- [ ] **Step 2: Add consent state to form**

Use four booleans: `personalData`, `rentalRules`, `paymentTerms`, `contactsAreCorrect`. Button is disabled unless all are true, required fields are filled, and at least one slot is selected.

- [ ] **Step 3: Replace `emailjs.send` and `addDoc` in public form**

`handleSubmit` calls `createPayment`, stores the returned `bookingId` in session storage as pending, then redirects:

```ts
window.location.href = result.confirmationUrl;
```

- [ ] **Step 4: Add legal pages**

`PrivacyPage` and `TermsPage` can start as clear, basic Russian text. Each page must state that final legal wording should be reviewed before production use, without showing unfinished markers in UI.

---

## Task 7: Add Payment Status Return Page

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/PaymentStatusPage.tsx`
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Add status API helper**

Extend `src/lib/api.ts`:

```ts
export interface PaymentStatusResponse {
  bookingId: string;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'expired';
  paymentStatus?: string;
}

export const getPaymentStatus = async (bookingId: string): Promise<PaymentStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/payment-status/${bookingId}`);
  if (!response.ok) throw new Error('Не удалось проверить статус оплаты');
  return response.json();
};
```

- [ ] **Step 2: Create return page**

`PaymentStatusPage` reads `bookingId` from `URLSearchParams`, polls `getPaymentStatus` every 2 seconds up to 30 seconds, remembers local booking id when status becomes `confirmed`, and shows one of three states: checking, success, error/manual contact.

- [ ] **Step 3: Add route**

In the lightweight router, map `/payment-status` to `PaymentStatusPage`.

---

## Task 8: Create Server Skeleton

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/index.ts`
- Create: `server/src/env.ts`
- Create: `server/.env.example`

- [ ] **Step 1: Install server dependencies**

Run in `server/` after creating package:

```bash
npm i express cors dotenv firebase-admin nodemailer
npm i -D typescript tsx @types/express @types/cors @types/node @types/nodemailer
```

- [ ] **Step 2: Create server package**

`server/package.json`:

```json
{
  "name": "dance-space-zal-server",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "latest",
    "dotenv": "latest",
    "express": "latest",
    "firebase-admin": "latest",
    "nodemailer": "latest"
  },
  "devDependencies": {
    "@types/cors": "latest",
    "@types/express": "latest",
    "@types/node": "latest",
    "@types/nodemailer": "latest",
    "tsx": "latest",
    "typescript": "latest"
  }
}
```

- [ ] **Step 3: Create env validation**

`server/src/env.ts` exports required variables and throws on missing values. Required keys: `PORT`, `FRONTEND_ORIGIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`, `YOOKASSA_RETURN_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `ADMIN_EMAIL`.

- [ ] **Step 4: Create Express entry**

`server/src/index.ts` loads dotenv, configures JSON body parsing, CORS for `FRONTEND_ORIGIN`, `GET /api/health`, and error handler returning `{ message }`.

---

## Task 9: Implement Server Booking Repository and YooKassa Client

**Files:**
- Create: `server/src/firebase-admin.ts`
- Create: `server/src/bookings-repo.ts`
- Create: `server/src/yookassa.ts`
- Create: `server/src/pricing.ts`

- [ ] **Step 1: Firebase Admin init**

Initialize Admin SDK with project id, client email, private key with escaped newlines converted:

```ts
privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
```

- [ ] **Step 2: Repository functions**

Implement:

```ts
findConflicts(date: string, timeSlots: string[]): Promise<string[]>;
createPendingBooking(input): Promise<string>;
confirmBooking(bookingId: string, paymentId: string): Promise<void>;
expireBooking(bookingId: string): Promise<void>;
cancelBooking(bookingId: string, reason: string): Promise<void>;
createBlockedSlots(input): Promise<string>;
deactivateBlockedSlot(id: string): Promise<void>;
getBooking(bookingId: string): Promise<Booking | null>;
recordPaymentEvent(input): Promise<void>;
```

Conflict detection checks confirmed bookings and active blocked slots.

- [ ] **Step 3: YooKassa payment creation**

Use `fetch('https://api.yookassa.ru/v3/payments', ...)` with Basic auth and `Idempotence-Key`. Request body contains `amount`, `confirmation.type = 'redirect'`, `confirmation.return_url`, `capture = true`, `description`, and `metadata.bookingId`.

- [ ] **Step 4: Server price is authoritative**

The backend recalculates total price from date, slots, and booking type. It ignores any client-provided amount.

---

## Task 10: Implement Public Payment Routes and Email

**Files:**
- Create: `server/src/routes/public.ts`
- Create: `server/src/routes/webhooks.ts`
- Create: `server/src/mailer.ts`
- Modify: `server/src/index.ts`

- [ ] **Step 1: `POST /api/create-payment`**

Validate body: date string, non-empty timeSlots array, bookingType, customer name/email/phone, all consents true. Check conflicts. Create pending booking. Create YooKassa payment. Save `paymentId`. Return `{ bookingId, confirmationUrl }`.

- [ ] **Step 2: `POST /api/yookassa-webhook`**

Read event payload. Record it in `paymentEvents`. If event is payment succeeded or payload object status is `succeeded`, load booking via metadata bookingId, re-check no confirmed conflict, confirm booking, send emails. If conflict appears at confirm time, mark booking for admin attention rather than double-booking.

- [ ] **Step 3: `GET /api/payment-status/:bookingId`**

Return booking status and paymentStatus for frontend polling.

- [ ] **Step 4: Email templates**

`sendCustomerBookingConfirmation(booking)` and `sendAdminBookingNotification(booking)` include booking id, customer details, slots, date, total price, address, and admin link.

---

## Task 11: Implement Admin Auth and Admin API

**Files:**
- Create: `server/src/auth.ts`
- Create: `server/src/routes/admin.ts`
- Create: `src/components/admin/admin-auth-guard.tsx`
- Create: `src/pages/AdminLoginPage.tsx`
- Create: `src/pages/AdminPage.tsx`

- [ ] **Step 1: Backend verifies Firebase ID token**

`auth.ts` reads `Authorization: Bearer <token>`, verifies with Firebase Admin, checks `adminUsers/{uid}.role == 'admin'`.

- [ ] **Step 2: Admin endpoints**

Create:

```text
POST /api/admin/cancel-booking
POST /api/admin/block-slots
POST /api/admin/unblock-slots
```

All require admin token.

- [ ] **Step 3: Frontend login**

`AdminLoginPage` uses Firebase Auth `signInWithEmailAndPassword(auth, email, password)`, then routes to `/admin`.

- [ ] **Step 4: Admin page functions**

`AdminPage` displays bookings and blocked slots from Firestore, provides buttons for cancel and unblock, and a form to block selected date/time slots.

---

## Task 12: Add Setup Documentation

**Files:**
- Create: `docs/setup/firebase.md`
- Create: `docs/setup/yookassa.md`
- Create: `docs/setup/email.md`
- Create: `docs/setup/vps.md`

- [ ] **Step 1: Firebase doc**

Include web app config, Firestore, Authentication Email/Password, admin user creation, `adminUsers` document, and rules publish.

- [ ] **Step 2: YooKassa doc**

Include test credentials, env variables, webhook URL `/api/yookassa-webhook`, return URL `/payment-status?bookingId={bookingId}` pattern generated by server.

- [ ] **Step 3: Email doc**

Include Gmail App Password setup for test and domain SMTP recommendation for production.

- [ ] **Step 4: VPS doc**

Include Node.js install, `npm run build`, PM2 app start, Nginx reverse proxy to backend port, static frontend serving, HTTPS via Certbot, and environment file placement.

---

## Task 13: Verification Pass

**Files:**
- No code creation required.

- [ ] **Step 1: Frontend type/build check**

Run:

```bash
npm run build
./node_modules/.bin/tsc --noEmit
```

Expected: exit code 0 for both.

- [ ] **Step 2: Server build check**

Run:

```bash
cd server && npm run build
```

Expected: exit code 0.

- [ ] **Step 3: Browser smoke test**

Open `http://127.0.0.1:5173/`. Verify: public page renders, no photo-studio wording, selected slots show total price, consent checkboxes gate payment button.

- [ ] **Step 4: API smoke test**

Run backend locally with `.env`. Call `GET /api/health`. Expected: `{ "ok": true }`.

- [ ] **Step 5: Payment test mode**

With YooKassa test credentials, create a payment from the public form. Expected: redirect URL is returned, pending booking exists, webhook confirmation moves it to confirmed, slot becomes unavailable, emails are attempted.

---

## Implementation Notes

- Do not put YooKassa or SMTP secrets in Vite env variables.
- Do not write public bookings directly from the browser after this migration.
- Keep old EmailJS code removed from the public form.
- Keep direct Firestore writes from public UI disabled by rules.
- If Firebase env is not available during local visual work, keep UI resilient with a clear setup error rather than silently using the old `lookbook-fb70e` project.
- Because `/Users/matvejvoroncov/Downloads/lookbeta1/dance-space-zal2` is outside the current workspace root, file writes may need explicit permission until the folder is opened as the active workspace.

## Self-Review

- Spec coverage: design cleanup, Firebase, YooKassa, email, consents, admin auth, manual blocking, cancellation, VPS docs, and verification are all mapped to tasks.
- Marker scan: the plan contains no `TBD`, `TODO`, or unspecified implementation slots.
- Type consistency: booking status, booking type, slot arrays, and endpoint names match the design spec.
