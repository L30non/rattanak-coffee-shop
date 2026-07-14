# Graph Report - .  (2026-07-14)

## Corpus Check
- 127 files · ~63,870 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 689 nodes · 1550 edges · 37 communities (30 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 118,564 input · 0 output

## Community Hubs (Navigation)
- Storefront Pages & Core UI
- Admin, Auth & Reviews
- Third-Party Dependencies
- Supabase Data & API Routes
- Error Tracking & Bakong Docs
- Navigation UI Components
- Sidebar & Overlay UI
- Charts & Responsive Hooks
- Header & User Menu
- TypeScript Config
- Package & Build Config
- Checkout Flow UI
- Popover & Utility UI
- Context Menu Component
- Carousel Component
- Drawer Component
- Form Components
- Bakong Payment API
- Pagination Component
- Toggle Components
- Bakong KHQR Types
- Blog Data Module
- Alert Component
- Auth Middleware
- Brand Logo Image
- Brand Logo SVG & Palette
- Email Test Script
- Route Mapping
- Toast Notifications
- Root Layout & Metadata
- Product Store
- SEO URL Helpers
- ESLint Config
- Next.js Config
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 221 edges
2. `Button()` - 32 edges
3. `createClient()` - 27 edges
4. `Card()` - 23 edges
5. `CardContent()` - 22 edges
6. `useAuth()` - 20 edges
7. `useStore` - 17 edges
8. `compilerOptions` - 16 edges
9. `getImageUrl()` - 16 edges
10. `react` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ErrorLogger` --references--> `Sentry Error Monitoring Integration`  [EXTRACTED]
  lib/errorTracking.ts → docs/PHASE3-IMPLEMENTATION.md
- `Bakong KHQR Payment Integration` --conceptually_related_to--> `Bakong Payment Platform`  [INFERRED]
  README.md → KHQR SDK Document.pdf
- `Bakong KHQR Payment Integration` --conceptually_related_to--> `KHQR Code Specification`  [INFERRED]
  README.md → KHQR SDK Document.pdf
- `Bakong KHQR Payment Integration` --references--> `MD5 Hash for Transaction Status Verification`  [INFERRED]
  README.md → KHQR SDK Document.pdf
- `Email Notifications System (Phase 3)` --semantically_similar_to--> `Resend Order Confirmation Emails`  [INFERRED] [semantically similar]
  docs/PHASE3-IMPLEMENTATION.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KHQR SDK Core API Surface** — khqr_sdk_document_bakongkhqr, khqr_sdk_document_generate_khqr, khqr_sdk_document_verify_khqr, khqr_sdk_document_decode_khqr, khqr_sdk_document_generate_deeplink [EXTRACTED 1.00]
- **Phase 3 Feature Set (Email, Error Monitoring, Image Optimization)** — docs_phase3_implementation_email_notifications, docs_phase3_implementation_error_monitoring, docs_phase3_implementation_image_optimization [EXTRACTED 1.00]
- **Bakong KHQR Payment and Verification Flow** — readme_bakong_khqr_payment, khqr_sdk_document_generate_khqr, khqr_sdk_document_md5_hash, khqr_sdk_document_bakong [INFERRED 0.85]

## Communities (37 total, 7 thin omitted)

### Community 0 - "Storefront Pages & Core UI"
Cohesion: 0.06
Nodes (72): App(), queryClient, AboutUs(), AboutUsProps, milestones, teamMembers, values, Account() (+64 more)

### Community 1 - "Admin, Auth & Reviews"
Cohesion: 0.05
Nodes (69): AddressForm(), AddressFormProps, AddressManagementProps, AdminDashboard(), AdminDashboardProps, AuthProps, ProductReviews(), ProductReviewsProps (+61 more)

### Community 2 - "Third-Party Dependencies"
Cohesion: 0.04
Nodes (52): dependencies, bakong-khqr, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, framer-motion (+44 more)

### Community 3 - "Supabase Data & API Routes"
Cohesion: 0.08
Nodes (34): DELETE(), GET(), PATCH(), PUT(), GET(), POST(), DELETE(), GET() (+26 more)

### Community 4 - "Error Tracking & Bakong Docs"
Cohesion: 0.06
Nodes (34): ErrorBoundary, Bakong API Documentation (identical copy of KHQR SDK Documentation v2.7), Phase 3 Implementation Guide, Email Notifications System (Phase 3), Error Boundary & Tracking (Phase 3), Image Optimization Enhancements (Phase 3), ImageWithFallback Component, Sentry Error Monitoring Integration (+26 more)

### Community 5 - "Navigation UI Components"
Cohesion: 0.08
Nodes (33): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), CardAction(), CardFooter() (+25 more)

### Community 6 - "Sidebar & Overlay UI"
Cohesion: 0.06
Nodes (38): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SheetTrigger() (+30 more)

### Community 7 - "Charts & Responsive Hooks"
Cohesion: 0.10
Nodes (19): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+11 more)

### Community 8 - "Header & User Menu"
Cohesion: 0.13
Nodes (15): HeaderProps, Avatar(), AvatarFallback(), AvatarImage(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+7 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Package & Build Config"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+10 more)

### Community 11 - "Checkout Flow UI"
Cohesion: 0.16
Nodes (14): BakongPayment(), Checkout(), CheckoutProps, Checkbox(), Select(), SelectContent(), SelectItem(), SelectLabel() (+6 more)

### Community 12 - "Popover & Utility UI"
Cohesion: 0.11
Nodes (6): HoverCardContent(), PopoverContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Switch()

### Community 13 - "Context Menu Component"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 14 - "Carousel Component"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 15 - "Drawer Component"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 16 - "Form Components"
Cohesion: 0.25
Nodes (9): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItemContext, FormItemContextValue, FormLabel(), FormMessage() (+1 more)

### Community 17 - "Bakong Payment API"
Cohesion: 0.33
Nodes (5): POST(), POST(), generateBakongKHQR(), KHQRGenerationResult, verifyBakongPayment()

### Community 18 - "Pagination Component"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 19 - "Toggle Components"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 20 - "Bakong KHQR Types"
Cohesion: 0.29
Nodes (4): bakong-khqr, BakongKHQR, IndividualInfo, KHQRResponse

### Community 21 - "Blog Data Module"
Cohesion: 0.33
Nodes (4): blogCategories, BlogPost, blogPosts, getPosts()

### Community 22 - "Alert Component"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 23 - "Auth Middleware"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

### Community 24 - "Brand Logo Image"
Cohesion: 0.70
Nodes (5): Coffee Plant with Berries Motif, Khmer Brand Text (កាហ្វេរតន:), Rattanak Coffee Circular Logo, Rattanak Coffee (Brand), Tagline: Life Begins After Coffee

### Community 25 - "Brand Logo SVG & Palette"
Cohesion: 0.60
Nodes (5): Brand Color Palette (maroon #5F1B2C, leaf green #9DC45F, bean brown #7A3D2E, beige #C8B299), Coffee Bean and Leaf Decorative Motif, Khmer Wordmark (Rattanak Coffee in Khmer script), Rattanak Coffee Circular Badge Logo, Tagline: LIFE BEGINS AFTER COFFEE

### Community 26 - "Email Test Script"
Cohesion: 0.40
Nodes (3): envContent, envPath, resend

### Community 28 - "Route Mapping"
Cohesion: 0.67
Nodes (3): PRODUCT_CATEGORIES, STATIC_VIEW_ROUTES, viewToHref()

## Knowledge Gaps
- **173 isolated node(s):** `queryClient`, `AboutUsProps`, `milestones`, `values`, `teamMembers` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Navigation UI Components` to `Storefront Pages & Core UI`, `Admin, Auth & Reviews`, `Sidebar & Overlay UI`, `Charts & Responsive Hooks`, `Header & User Menu`, `Checkout Flow UI`, `Popover & Utility UI`, `Context Menu Component`, `Carousel Component`, `Drawer Component`, `Form Components`, `Pagination Component`, `Toggle Components`, `Alert Component`?**
  _High betweenness centrality (0.400) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Third-Party Dependencies` to `Package & Build Config`, `Toast Notifications`, `Charts & Responsive Hooks`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `ErrorBoundary` connect `Error Tracking & Bakong Docs` to `Storefront Pages & Core UI`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `queryClient`, `AboutUsProps`, `milestones` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Storefront Pages & Core UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05998835177635411 - nodes in this community are weakly interconnected._
- **Should `Admin, Auth & Reviews` be split into smaller, more focused modules?**
  _Cohesion score 0.05158324821246169 - nodes in this community are weakly interconnected._
- **Should `Third-Party Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._