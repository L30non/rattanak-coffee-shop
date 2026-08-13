# Graph Report - .  (2026-08-13)

## Corpus Check
- 31 files · ~66,403 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 715 nodes · 1467 edges · 40 communities (31 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App Shell & Content Pages
- Account & Auth UI
- Package Dependencies
- Error Boundary & Docs
- Sheet / Drawer Primitives
- Address & Order API Routes
- Avatar & Breadcrumb UI
- Address Form & Command UI
- Address Management & Alert Dialog
- Hover Card / Progress / Switch UI
- TypeScript Config
- Chart UI Primitives
- Package Dev Dependencies
- Menubar UI Primitives
- Context Menu UI Primitives
- Dropdown Menu UI Primitives
- Carousel UI Primitives
- Galleries API & Admin Guard
- Form UI Primitives
- Select UI Primitives
- Navigation Menu UI Primitives
- Bakong Payment API & Lib
- Brand Logo & Motifs
- Bakong KHQR Types
- Input OTP UI Primitives
- Alert UI Primitives
- Popover UI Primitives
- Auth Middleware
- Test Email Script
- Auth Callback Route
- Toast Notifications
- Root Layout
- Product Filter Store
- SEO Helpers
- ESLint Config
- Next.js Config
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 221 edges
2. `createClient()` - 25 edges
3. `useAuth()` - 22 edges
4. `Button()` - 20 edges
5. `useStore` - 19 edges
6. `getImageUrl()` - 18 edges
7. `compilerOptions` - 16 edges
8. `react` - 15 edges
9. `Card()` - 14 edges
10. `CardContent()` - 13 edges

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

## Communities (40 total, 9 thin omitted)

### Community 0 - "App Shell & Content Pages"
Cohesion: 0.05
Nodes (72): App(), AppContent(), queryClient, AboutUs(), AboutUsProps, TeamMember, teamMembers, values (+64 more)

### Community 1 - "Account & Auth UI"
Cohesion: 0.08
Nodes (47): Account(), AccountProps, Auth(), AuthProps, BakongPaymentProps, KHQRData, Props, State (+39 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.04
Nodes (52): dependencies, bakong-khqr, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, framer-motion (+44 more)

### Community 3 - "Error Boundary & Docs"
Cohesion: 0.06
Nodes (34): ErrorBoundary, Bakong API Documentation (identical copy of KHQR SDK Documentation v2.7), Phase 3 Implementation Guide, Email Notifications System (Phase 3), Error Boundary & Tracking (Phase 3), Image Optimization Enhancements (Phase 3), ImageWithFallback Component, Sentry Error Monitoring Integration (+26 more)

### Community 4 - "Sheet / Drawer Primitives"
Cohesion: 0.06
Nodes (38): Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+30 more)

### Community 5 - "Address & Order API Routes"
Cohesion: 0.10
Nodes (27): DELETE(), GET(), PATCH(), PUT(), GET(), POST(), DELETE(), GET() (+19 more)

### Community 6 - "Avatar & Breadcrumb UI"
Cohesion: 0.09
Nodes (28): Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+20 more)

### Community 7 - "Address Form & Command UI"
Cohesion: 0.11
Nodes (23): AddressForm(), AddressFormProps, ProductSearchDialog(), ProductSearchDialogProps, Checkbox(), Command(), CommandDialog(), CommandEmpty() (+15 more)

### Community 8 - "Address Management & Alert Dialog"
Cohesion: 0.11
Nodes (21): AddressManagement(), AddressManagementProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+13 more)

### Community 9 - "Hover Card / Progress / Switch UI"
Cohesion: 0.11
Nodes (11): HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Switch(), Textarea(), ToggleGroup(), ToggleGroupContext (+3 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "Chart UI Primitives"
Cohesion: 0.15
Nodes (15): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+7 more)

### Community 12 - "Package Dev Dependencies"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+10 more)

### Community 13 - "Menubar UI Primitives"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 14 - "Context Menu UI Primitives"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 15 - "Dropdown Menu UI Primitives"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "Carousel UI Primitives"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 17 - "Galleries API & Admin Guard"
Cohesion: 0.27
Nodes (9): DELETE(), PUT(), GET(), POST(), Gallery, getGalleries, requireAdmin(), RequireAdminResult (+1 more)

### Community 18 - "Form UI Primitives"
Cohesion: 0.25
Nodes (9): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItemContext, FormItemContextValue, FormLabel(), FormMessage() (+1 more)

### Community 19 - "Select UI Primitives"
Cohesion: 0.18
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 20 - "Navigation Menu UI Primitives"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 21 - "Bakong Payment API & Lib"
Cohesion: 0.33
Nodes (5): POST(), POST(), generateBakongKHQR(), KHQRGenerationResult, verifyBakongPayment()

### Community 22 - "Brand Logo & Motifs"
Cohesion: 0.36
Nodes (9): Coffee Plant with Berries Motif, Khmer Brand Text (កាហ្វេរតន:), Rattanak Coffee Circular Logo, Brand Color Palette (maroon #5F1B2C, leaf green #9DC45F, bean brown #7A3D2E, beige #C8B299), Coffee Bean and Leaf Decorative Motif, Khmer Wordmark (Rattanak Coffee in Khmer script), Tagline: LIFE BEGINS AFTER COFFEE, Rattanak Coffee (Brand) (+1 more)

### Community 23 - "Bakong KHQR Types"
Cohesion: 0.29
Nodes (4): bakong-khqr, BakongKHQR, IndividualInfo, KHQRResponse

### Community 24 - "Input OTP UI Primitives"
Cohesion: 0.33
Nodes (4): InputOTP(), InputOTPGroup(), InputOTPSlot(), input-otp

### Community 25 - "Alert UI Primitives"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 27 - "Auth Middleware"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

### Community 28 - "Test Email Script"
Cohesion: 0.40
Nodes (3): envContent, envPath, resend

## Knowledge Gaps
- **173 isolated node(s):** `AccountProps`, `AddressManagementProps`, `AuthProps`, `KHQRData`, `BakongPaymentProps` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Avatar & Breadcrumb UI` to `Account & Auth UI`, `Sheet / Drawer Primitives`, `Address Form & Command UI`, `Address Management & Alert Dialog`, `Hover Card / Progress / Switch UI`, `Chart UI Primitives`, `Menubar UI Primitives`, `Context Menu UI Primitives`, `Dropdown Menu UI Primitives`, `Carousel UI Primitives`, `Form UI Primitives`, `Select UI Primitives`, `Navigation Menu UI Primitives`, `Input OTP UI Primitives`, `Alert UI Primitives`, `Popover UI Primitives`?**
  _High betweenness centrality (0.476) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Input OTP UI Primitives`, `Chart UI Primitives`, `Package Dev Dependencies`, `Toast Notifications`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `react` connect `Chart UI Primitives` to `Package Dependencies`, `Sheet / Drawer Primitives`, `Hover Card / Progress / Switch UI`, `Carousel UI Primitives`, `Form UI Primitives`, `Input OTP UI Primitives`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **What connects `AccountProps`, `AddressManagementProps`, `AuthProps` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Shell & Content Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05283505154639175 - nodes in this community are weakly interconnected._
- **Should `Account & Auth UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07950310559006211 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._