# E-commerce Cart & Checkout — Setup & Stable Baseline

A Vue 3 + TypeScript + Pinia + Quasar + Vue Router + Vitest practice project focused on **frontend state architecture and Staff-level frontend system design**.

This README records the setup process, important decisions, issues encountered, and the stable application structure reached during the first implementation pass.

---

## 1. Project Goal

Build a production-style e-commerce flow that gives practice with:

- Vue 3 Composition API
- TypeScript
- Pinia state architecture
- Quasar UI
- Vue Router
- Mock API/service boundaries
- Derived state
- Optimistic updates
- Rollback
- Persistence
- Guest cart → authenticated cart merge
- Checkout state modelling
- Unit/component testing
- Staff-level frontend architecture reasoning

The intended user flow is:

```text
Login
  ↓
Products
  ↓
Add to Cart
  ↓
Cart
  ↓
Quantity Update / Rollback
  ↓
Checkout
  ↓
Success / Error
```

---

# 2. Project Creation

The project was created using the Quasar CLI:

```bash
npm create quasar@latest
```

Project configuration:

- Quasar v2
- TypeScript: Yes
- SCSS
- SPA
- ESLint
- Prettier
- Pinia
- Vue Router
- Vue 3 Composition API

Then:

```bash
npm install
```

Initial verification:

```bash
npm run typecheck
```

---

# 3. Verify the Quasar-Generated Structure

The Quasar project generated the main structure:

```text
src/
├── App.vue
├── assets/
├── boot/
├── components/
├── css/
├── pages/
├── router/
└── stores/
```

Important generated files:

```text
src/stores/index.ts
src/router/index.ts
```

The project uses Quasar's generated Pinia boot setup and Vue Router auto-routes.

The router uses hash history:

```text
http://localhost:9000/#/
```

---

# 4. Important Quasar Setup Rule

One of the first runtime issues was:

```text
QPage needs to be a deep child of QLayout
```

The required hierarchy is:

```text
QLayout
└── QPageContainer
    └── router-view
        └── QPage
```

Therefore:

```text
App.vue
└── QLayout
    ├── QHeader
    └── QPageContainer
        └── router-view
            ├── Login QPage
            ├── Products QPage
            ├── Cart QPage
            └── Checkout QPage
```

Do **not** render a `QPage` directly below `App` or another component without the required Quasar layout hierarchy.

This rule should be checked whenever a new page is added.

---

# 5. Page Structure

The generated demo pages were removed/replaced.

The application uses:

```text
src/pages/
├── index.vue
├── products/
│   └── index.vue
├── cart.vue
├── checkout.vue
└── [...path].vue
```

### `/`

Login page.

Purpose:

- Default application entry
- Demo authentication
- Redirect message support
- Login validation
- Guest → authenticated cart merge

### `/products`

Product catalogue.

Purpose:

- Load products
- Display product cards
- Add products to cart
- Display current cart count
- Navigate to Cart
- Navigate to Checkout when cart is non-empty

### `/cart`

Cart page.

Purpose:

- Display cart items
- Change quantity
- Remove items
- Show derived totals
- Continue to checkout

### `/checkout`

Checkout page.

Purpose:

- Address/payment information
- Checkout state machine
- Processing state
- Success/error state

### `[...path].vue`

Catch-all/404 page.

---

# 6. Import Alias Rule

A TypeScript error occurred when using:

```ts
import { useAuthStore } from 'src/stores/auth'
```

The project is configured to use the `@` source alias.

Use:

```ts
import { useAuthStore } from '@/stores/auth'
```

Use `@/` consistently for application source imports.

Avoid:

```ts
src/...
```

inside imports.

---

# 7. Vitest Setup

Vitest and Vue Test Utils were installed:

```bash
npm install -D vitest @vue/test-utils
```

Instead of manually maintaining a separate Vitest configuration, the Quasar testing extension was used:

```bash
npx quasar ext add @quasar/testing-unit-vitest
```

When prompted:

```text
Vitest UI?
```

Choose:

```text
No
```

The extension added the testing scripts:

```json
"test": "echo \"See package.json => scripts for available tests.\" && exit 0",
"test:unit": "vitest",
"test:unit:ci": "vitest run"
```

Generated example tests were removed.

The project uses:

```text
test/
└── vitest/
    └── __tests__/
```

---
## Quasar Component Test Helper

Quasar components need Quasar itself initialized when they are mounted in Vue Test Utils.

Without this, tests for components such as `QCard`, `QBtn`, and `QBadge` can fail with:

```text
Cannot read properties of undefined (reading 'dark')

mountWithQuasar.ts
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

export function mountWithQuasar(
  component: Parameters<typeof mount>[0],
  options: Parameters<typeof mount>[1] = {},
) {
  return mount(component, {
    ...options,
    global: {
      ...options?.global,
      plugins: [
        Quasar,
        ...(options?.global?.plugins ?? []),
      ],
    },
  })
}


# 8. Testing Commands

Development/watch mode:

```bash
npm run test:unit
```

CI/one-shot mode:

```bash
npm run test:unit:ci
```

Type checking:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint:check
```

Development server:

```bash
npm run dev
```

A stable project should pass:

```bash
npm run typecheck
npm run lint:check
npm run test:unit:ci
```

---

# 9. Stable Application Architecture

The current intended structure is:

```text
src/
├── App.vue
│
├── components/
│   ├── cart/
│   │   ├── CartItem.vue
│   │   └── CartSummary.vue
│   │
│   ├── products/
│   │   └── ProductCard.vue
│   │
│   └── common/
│       └── AppLoading.vue
│
├── pages/
│   ├── index.vue
│   ├── products/
│   │   └── index.vue
│   ├── cart.vue
│   ├── checkout.vue
│   └── [...path].vue
│
├── router/
│   └── index.ts
│
├── stores/
│   ├── auth.ts
│   ├── products.ts
│   ├── cart.ts
│   └── checkout.ts
│
├── services/
│   ├── api.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── checkout.service.ts
│
├── types/
│   ├── api.ts
│   ├── product.ts
│   ├── cart.ts
│   ├── checkout.ts
│   └── user.ts
│
└── css/
    └── app.scss
```

Tests:

```text
test/
└── vitest/
    └── __tests__/
        ├── stores/
        │   ├── auth.test.ts
        │   ├── cart.test.ts
        │   └── checkout.test.ts
        │
        ├── services/
        │   └── cart.service.test.ts
        │
        └── components/
            ├── ProductCard.test.ts
            └── CartSummary.test.ts
```

---

# 10. Domain Types

The application deliberately models the domain with TypeScript.

Important models include:

```text
Product
ProductSnapshot
CartItem
Cart
Coupon
CartTotals
Address
User
PaymentState
CheckoutRequest
OrderLineItem
Order
CheckoutState
ApiResponse<T>
```

The application should avoid:

```ts
any
```

where a meaningful domain type can be defined.

---

# 11. Authentication

Authentication is intentionally mocked.

`auth.ts` owns:

- authentication state
- email
- display name
- login
- logout
- persisted authentication state

Authentication is persisted using:

```text
ecommerce-auth
```

in `localStorage`.

Invalid/corrupted persisted authentication is discarded.

The login page accepts any non-empty credentials because this is a frontend architecture exercise rather than a real authentication system.

---

# 12. Cart Persistence

Cart persistence uses:

```text
ecommerce-cart
```

in `localStorage`.

The persisted structure includes a version:

```ts
{
  version: 1,
  cart: {
    version: 1,
    items: []
  }
}
```

The version allows future migrations or invalidation.

Corrupted localStorage should result in an empty cart rather than crashing the application.

---

# 13. Vue Reactive State and Serialization

An important implementation issue occurred when attempting:

```ts
structuredClone(cart.value)
```

`cart.value` can contain Vue reactive Proxy objects.

The browser produced:

```text
Failed to execute 'structuredClone' on 'Window':
#<Object> could not be cloned.
```

The store therefore converts the reactive state to a raw object before cloning:

```ts
toRaw(cart)
```

The current helper creates a plain serializable snapshot before persistence/API operations.

This is important for:

- optimistic update snapshots
- rollback
- localStorage
- mock API boundaries

The conceptual boundary is:

```text
Vue reactive state
      ↓
toRaw()
      ↓
plain domain object
      ↓
clone / serialize
      ↓
API or localStorage
```

---

# 14. Cart State

Cart-derived state is calculated rather than unnecessarily duplicated.

Important computed values:

```text
itemCount
subtotal
discount
shipping
total
totals
```

For example:

```text
subtotal
  ↓
shipping
  ↓
total
```

The goal is to avoid maintaining multiple independent mutable copies of values that can be derived from cart items.

---

# 15. Optimistic Cart Updates

Quantity updates use an optimistic approach.

Flow:

```text
User changes quantity
        ↓
Save previous cart snapshot
        ↓
Update UI immediately
        ↓
Persist optimistic state
        ↓
Call mock API
        ↓
     ┌───┴────┐
     ↓        ↓
  Success   Failure
     ↓        ↓
Confirm    Restore snapshot
```

The cart store also tracks mutation IDs per product to prevent an older asynchronous response from overwriting a newer mutation.

This is an important future Staff-level discussion topic:

> Client-side mutation ordering is not the same thing as server-side consistency.

---

# 16. Mock Cart API

The mock service simulates:

- server cart
- network delay
- cart quantity updates
- cart replacement
- server cart retrieval
- simulated mutation failures

A failure can be triggered with:

```ts
simulateNextCartFailure()
```

This allows rollback behavior to be tested deterministically.

---

# 17. Guest Cart → Server Cart Merge

When a user logs in:

```text
Guest cart
    +
Server cart
    ↓
Merge
    ↓
Replace server cart
    ↓
Update local cart
```

If the same product exists in both carts, quantities are combined.

Example:

```text
Guest:
Headphones × 2

Server:
Headphones × 1

Merged:
Headphones × 3
```

This is intentionally modeled as a separate state transition because guest-cart merge is a meaningful real-world architecture problem.

---

# 18. Product Store

`products.ts` owns:

- product collection
- loading state
- product loading errors
- loading products
- available products

Product data is supplied by:

```text
product.service.ts
```

The service simulates a backend API.

---

# 19. ProductCard Event Contract

An integration bug occurred because the child component emitted:

```ts
emit('add', product)
```

while the parent listened for:

```vue
@add-to-cart="addToCart"
```

Therefore the parent handler never executed.

The stable contract is:

```text
ProductCard
    ↓
emit('add-to-cart', product)
    ↓
Products page
    ↓
cartStore.addItem(product)
```

The child sends the complete `Product` rather than only the product ID.

This avoids an unnecessary:

```text
Product
 ↓
productId
 ↓
search products again
 ↓
Product
```

lookup in the parent.

---

# 20. Quasar Notify

An error occurred:

```text
$q.notify is not a function
```

The cause was that Quasar's Notify plugin had not been registered.

The Quasar configuration enables:

```ts
framework: {
  plugins: ['Notify'],
}
```

This allows:

```ts
const $q = useQuasar()

$q.notify({
  type: 'positive',
  message: 'Product added to cart',
})
```

---

# 21. Products Page Flow

The Products page currently supports:

```text
Product catalogue
       ↓
Add to cart
       ↓
Cart count updates
       ↓
Cart button
       ↓
Checkout button appears when cart is non-empty
```

When there are no items:

```text
Cart (0)
```

When items exist:

```text
Cart (1)
Checkout
```

---

# 22. Checkout

Checkout uses a discriminated union state model.

Conceptually:

```text
idle
 ↓
validating
 ↓
processing
 ↓
success
```

or:

```text
idle
 ↓
validating
 ↓
error
```

This is intentionally modelled as a state machine rather than multiple unrelated booleans such as:

```ts
isLoading
isSuccess
hasError
isProcessing
```

The purpose is to prevent invalid combinations of state.

---

# 23. Login Protection

The intended application behavior is:

```text
Unauthenticated user
       ↓
Protected page
       ↓
Redirect to login
       ↓
"Please log in to continue."
```

After successful login:

```text
Login
  ↓
Cart merge
  ↓
Products
```

Logout returns the user to the login flow and resets appropriate authenticated state.

---

# 24. Page/Layout Rule

Every page containing:

```vue
<q-page>
```

must ultimately be rendered under:

```vue
<q-layout>
  <q-page-container>
    <router-view />
  </q-page-container>
</q-layout>
```

If a new page produces:

```text
QPage needs to be a deep child of QLayout
```

check the application shell and route nesting first.

Do not solve this by adding another `QLayout` to the page.

---

# 25. Current Stable Verification

Before considering the baseline stable, run:

```bash
npm run typecheck
npm run lint:check
npm run test:unit:ci
```

Then:

```bash
npm run dev
```

Verify:

```text
1. Login page opens
2. Login works
3. Products page opens
4. Products load
5. Add to cart works
6. Cart count changes
7. Cart page shows the item
8. Quantity changes work
9. Checkout can be reached
10. Logout returns to login
```

---

# 26. Git Workflow

The project is maintained in GitHub.

Repository:

```text
https://github.com/Bala-Chandra/ecommerce-cart-checkout
```

Recommended workflow:

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

After meaningful milestones, push the working state.

GitHub should be treated as the source of truth for the committed project state.

---

# 27. Development Workflow Going Forward

The first implementation took significantly longer than intended because too much time went into setup, wiring, and debugging.

For the remaining mastery projects, use this model:

```text
~30 minutes
APPLICATION BUILD
────────────────────────
- Create project
- Apply known setup baseline
- Add prepared stable skeleton
- Run
- Verify core user flow

~3.5 hours
MASTERY
────────────────────────
- Understand architecture
- Understand state ownership
- Trace data flow
- Understand component boundaries
- Understand TypeScript models
- Study async behavior
- Study failure cases
- Refactor
- Add tests
- Discuss alternatives
- Practice Staff-level interview questions
```

The objective is **not** to spend the majority of the session fighting project scaffolding.

The objective is:

> Get the application running quickly, then spend the majority of the time understanding and designing it.

---

# 28. Standard Setup Baseline for Future Projects

Future projects should reuse the lessons from this project.

### Step 1

```bash
npm create quasar@latest
```

Use:

```text
Quasar v2
TypeScript
SCSS
SPA
ESLint
Prettier
```

### Step 2

```bash
npm install
```

### Step 3

```bash
npm run typecheck
```

### Step 4

Install testing:

```bash
npm install -D vitest @vue/test-utils
npx quasar ext add @quasar/testing-unit-vitest
```

Choose:

```text
Vitest UI? → No
```

### Step 5

Immediately establish:

```text
App shell
QLayout
QPageContainer
router-view
```

### Step 6

Establish pages before feature code:

```text
Login
Main page
Secondary pages
404
```

### Step 7

Establish:

```text
types/
services/
stores/
components/
pages/
tests/
```

### Step 8

Run:

```bash
npm run typecheck
npm run lint:check
npm run test:unit:ci
```

### Step 9

Only then begin feature implementation.

---

# 29. Things We Should Avoid Repeating

### Avoid 1 — Building setup manually for too long

The standard setup should be reused.

### Avoid 2 — Creating unnecessary config files

Use the Quasar testing extension rather than manually creating redundant Vitest configuration unless a project specifically requires it.

### Avoid 3 — Mixing import styles

Use:

```ts
@/...
```

not:

```ts
src/...
```

### Avoid 4 — Ignoring Quasar hierarchy

Always establish:

```text
QLayout
 → QPageContainer
   → router-view
     → QPage
```

before adding pages.

### Avoid 5 — Hiding real errors

Don't replace every caught exception with a generic message while debugging.

Prefer:

```ts
catch (error) {
  errorMessage.value =
    error instanceof Error
      ? error.message
      : 'Something went wrong.'
}
```

### Avoid 6 — Guessing component contracts

When a child emits an event, the parent listener must use exactly the same event name.

Example:

```text
emit('add-to-cart', product)
```

must match:

```vue
@add-to-cart="addToCart"
```

### Avoid 7 — Patching individual errors without checking the architecture

When multiple integration errors appear, inspect the actual data flow:

```text
Component
 ↓
Store
 ↓
Service
 ↓
State
 ↓
UI
```

rather than repeatedly silencing compiler/runtime errors.

---

# 30. Mastery Phase

The implementation phase is now considered complete enough to begin the learning phase.

The next phase should focus on:

1. Complete user-flow walkthrough
2. Component-by-component code understanding
3. Pinia store boundaries
4. Why each piece of state belongs where it does
5. Derived state
6. Optimistic updates
7. Rollback
8. Async concurrency
9. Persistence
10. Guest/server cart merge
11. Checkout state machine
12. TypeScript modelling
13. Testing strategy
14. Alternative architectures
15. Staff-level frontend system design questions

The implementation should be treated as a **case study for frontend architecture**, not merely as an application to finish.

---

## Stable Baseline Principle

For future projects:

> **Build fast. Understand deeply.**

The application should be runnable within approximately 30 minutes. The remaining time should be spent on architecture, reasoning, implementation understanding, trade-offs, testing, and Staff-level interview preparation.
