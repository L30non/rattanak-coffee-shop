# Phase 3 Implementation Instructions

This document provides instructions for completing Phase 3 setup: Email Notifications, Error Monitoring, and Image Optimization.

## ✅ Completed Features

### 1. Email Notifications System

- **Email Service**: `/lib/email.ts` - Resend email integration with order confirmation templates
- **API Integration**: Modified `/app/api/orders/route.ts` to send confirmation emails on order creation
- **HTML Template**: Professional email template with:
  - Brand colors (#5F1B2C burgundy)
  - Order details, items, pricing breakdown
  - Tracking number display
  - Responsive design

### 2. Error Boundary & Tracking

- **Error Boundary**: `/app/components/ErrorBoundary.tsx` - React error boundary with fallback UI
- **Error Logging**: `/lib/errorTracking.ts` - Utility for logging errors with Sentry support
- **App Integration**: Wrapped App in ErrorBoundary for global error catching
- **Features**:
  - Development mode shows detailed error info
  - Production mode hides details, shows friendly message
  - Automatic Sentry integration when available
  - User context tracking

### 3. Image Optimization Enhancements

- **Enhanced ImageWithFallback**: Added blur placeholder support
- **Next.js Config**: Optimized image settings in `next.config.ts`:
  - AVIF and WebP format support
  - Multiple device sizes for responsive images
  - 30-day cache TTL
  - Comprehensive image sizes

## 🔧 Required Setup Steps

### Step 1: Install Dependencies

```bash
npm install resend
```

For Sentry (optional but recommended):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Step 2: Configure Environment Variables

Add to `.env.local`:

```env
# Resend API Key (Required for emails)
RESEND_API_KEY=re_your_api_key_here

# Sentry DSN (Optional, for error monitoring)
SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_auth_token_here
```

### Step 3: Configure Email Domain

In Resend dashboard:

1. Add and verify your domain (e.g., rattanakcoffee.com)
2. Update `from` address in `/lib/email.ts`:
   ```typescript
   from: "Rattanak Coffee Shop <orders@your-domain.com>",
   ```

### Step 4: Verify Supabase Migrations

Ensure Phase 1 and Phase 2 migrations are applied:

- `/utils/supabase/migrations/phase1-tracking-tax.sql`
- `/utils/supabase/migrations/phase2-reviews-analytics.sql`

Run in Supabase SQL Editor if not already applied.

## 📧 Email Notifications Usage

The system automatically sends order confirmation emails when:

- A new order is created via POST `/api/orders`
- User has a valid email address
- `RESEND_API_KEY` is set in environment

**Email includes:**

- Order details and tracking number
- Product items with quantities and prices
- Tax (10% VAT) and shipping breakdown
- Shipping address
- Payment instructions (Cash on Delivery)

**To extend:**

- Add order status update emails in `/app/api/orders/[id]/route.ts`
- Create shipping notification emails
- Add abandoned cart emails

## 🚨 Error Monitoring Usage

### Using ErrorLogger:

```typescript
import { ErrorLogger } from "@/lib/errorTracking";

try {
  // Some risky operation
} catch (error) {
  ErrorLogger.logError(error as Error, {
    component: "ProductList",
    action: "fetch-products",
    metadata: { userId: user.id },
  });
}
```

### Using the Hook:

```typescript
import { useErrorTracking } from "@/lib/errorTracking";

function MyComponent() {
  const { trackError, trackAction } = useErrorTracking("MyComponent");

  const handleClick = async () => {
    trackAction("button-clicked", { buttonId: "submit" });
    try {
      await submitForm();
    } catch (error) {
      trackError(error as Error, "form-submit", { formData });
    }
  };
}
```

## 🖼️ Image Optimization Usage

### Basic Usage:

```tsx
<ImageWithFallback
  src={product.image_url}
  alt={product.name}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### With Priority (above-the-fold images):

```tsx
<ImageWithFallback src={heroImage} alt="Hero" priority sizes="100vw" />
```

### With Blur Placeholder (future enhancement):

```tsx
<ImageWithFallback
  src={product.image_url}
  alt={product.name}
  placeholder="blur"
  blurDataURL={product.blur_data_url}
/>
```

## 🎯 Testing Checklist

- [ ] Install `resend` package
- [ ] Add `RESEND_API_KEY` to `.env.local`
- [ ] Configure and verify domain in Resend
- [ ] Create a test order and verify email is sent
- [ ] Check email formatting in multiple email clients
- [ ] Trigger an error and verify ErrorBoundary catches it
- [ ] Verify images load with optimized formats (check Network tab)
- [ ] Test fallback images when src is invalid
- [ ] (Optional) Set up Sentry and verify error reporting

## 🚀 Production Deployment

Before deploying:

1. Verify all environment variables are set in production
2. Test email sending in staging environment
3. Verify Sentry is configured (if using)
4. Check that images are properly optimized
5. Test error boundary in production mode
6. Monitor first few orders to ensure emails send successfully

## 📊 Phase 3 Status

**Email Notifications**: ✅ Implemented (requires Resend setup)
**Error Monitoring**: ✅ Implemented (Sentry integration ready)
**Image Optimization**: ✅ Enhanced (blur placeholder support added)

**Next Phase**: Phase 4 (Advanced Features - Social Sharing, Wishlist, Gift Cards, Subscription, Mobile App)
