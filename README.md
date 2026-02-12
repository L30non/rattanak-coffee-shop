# RATTANAK COFFEE

**"The Starting Point of Your Cafe Journey"**

A fully functional e-commerce web application for selling professional coffee supplies — from espresso machines to beans to cafe accessories.

## Project Description

Cambodia's cafe scene is booming, but many small cafe owners still struggle to find a reliable and centralized supplier. Rattanak Coffee solves this by providing a single platform with transparent pricing, detailed product information, and delivery options.

**Target Audience:** Cafe shop owners, baristas, restaurant businesses, and home coffee enthusiasts.

## Features

### Customer

- **Product Browsing** — Browse products across four categories: Machines, Beans, Accessories, and Ingredients
- **Search & Filter** — Find products by name, description, category, or origin
- **Product Details** — View descriptions, pricing, stock levels, and product attributes (roast level, origin, weight, etc.)
- **Reviews & Ratings** — Read and write product reviews with 1-5 star ratings
- **Shopping Cart** — Add/remove items with real-time subtotal, tax (10% VAT), and shipping calculations
- **Checkout** — Complete orders with Bakong KHQR payment or Cash on Delivery
- **User Accounts** — Sign up, sign in, manage profile, and view order history
- **Saved Addresses** — Store multiple shipping addresses with a default option for quick checkout
- **Order Tracking** — Receive confirmation emails with tracking numbers and follow order status

### Admin

- **Product Management** — Create, edit, and delete products with image uploads
- **Order Management** — View all orders and update statuses (pending, processing, shipped, delivered, cancelled)
- **Inventory Tracking** — Monitor and manage product stock levels

## Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| Frontend         | React 19, Next.js 16, TypeScript, Tailwind CSS 4            |
| UI Components    | shadcn/ui (Radix UI), Lucide Icons, Framer Motion           |
| State Management | Zustand (client state), TanStack React Query (server state) |
| Database         | Supabase (PostgreSQL)                                       |
| Authentication   | Supabase Auth                                               |
| Storage          | Supabase Storage (product images)                           |
| Payments         | Bakong KHQR (Cambodian QR payment)                          |
| Email            | Resend (order confirmation emails)                          |
| Deployment       | Vercel                                                      |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/rattanak-coffee-shop.git
   cd rattanak-coffee-shop
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables) below).

4. Set up the database by running the SQL files in `utils/supabase/` in order:
   - `schema.sql` — Base tables (products, profiles, orders, order_items)
   - Migration files in `utils/supabase/migrations/` for additional tables and policies

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
rattanak-coffee-shop/
├── app/
│   ├── api/            # API routes (products, orders, addresses, reviews, payments)
│   ├── components/     # React components (HomePage, Cart, Checkout, Admin, etc.)
│   ├── hooks/          # Custom hooks (useAuth, useProducts)
│   └── store/          # Zustand state management
├── lib/                # Email service, Bakong payment, error tracking
├── utils/
│   └── supabase/       # Database client, schema, and migrations
├── public/             # Static assets
└── middleware.ts       # Auth session management
```

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable                                       | Description                                     |
| ---------------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Your Supabase project URL                       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Your Supabase publishable (anon) key            |
| `BAKONG_ACCOUNT_ID`                            | Bakong merchant account ID                      |
| `BAKONG_MERCHANT_NAME`                         | Merchant display name                           |
| `BAKONG_MERCHANT_CITY`                         | Merchant city                                   |
| `BAKONG_MOBILE_NUMBER`                         | Merchant phone number                           |
| `BAKONG_PROD_BASE_API_URL_MD5`                 | Bakong API endpoint for payment verification    |
| `BAKONG_TOKEN`                                 | Bakong API authentication token                 |
| `RESEND_API_KEY`                               | Resend API key for sending emails               |
| `NEXT_PUBLIC_APP_URL`                          | Application URL (e.g., `http://localhost:3000`) |

## Database Schema

The application uses six PostgreSQL tables managed through Supabase:

| Table             | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `products`        | Product catalog with categories, pricing, stock, and search vectors |
| `profiles`        | User accounts linked to Supabase Auth                               |
| `orders`          | Customer orders with status tracking and payment info               |
| `order_items`     | Individual items within each order                                  |
| `product_reviews` | User reviews with ratings (one per user per product)                |
| `addresses`       | Saved shipping addresses with default selection                     |

Row Level Security (RLS) policies are applied to all tables. Full schema details are in `utils/supabase/schema.sql` and the migration files in `utils/supabase/migrations/`.

## Deployment

This application is optimized for [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project on Vercel.
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy.

Alternatively, build and run manually:

```bash
npm run build
npm start
```

## Author

**Hong Rattanak**
IT Academy STEP Cambodia Institute

- Email: hongrattanak88@gmail.com
- Phone: +855 12 828 029

**Mentor:** Mr. Tal Tongsreng — Instructor at IT Academy STEP Cambodia
