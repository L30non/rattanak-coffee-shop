/**
 * Everything the website chatbot knows about the company, besides the live
 * product catalog (which lib/chat/prompt.ts loads from Supabase). Edit this
 * text freely — it is plain markdown handed to the model as-is. If a fact
 * isn't written here or in the catalog, the bot is told to say it doesn't
 * know and point the customer to the shop's contact details.
 */
export const COMPANY_KNOWLEDGE = `
# Rattanak Coffee

Coffee roaster and coffee-business supplier in Phnom Penh, Cambodia.
Tagline: "The Starting Point of Your Cafe Journey".
Roasting coffee since 1997. Our coffee is made by the people, for the people.

## What we sell
- Coffee machines: 1-group and 2-group espresso machines, grinders, blenders — for home, office and commercial use.
- Coffee beans: roasted beans and green beans. We source green beans from across Cambodia and the globe and roast them in-house (Robusta and Arabica). Our three best-selling blends: Bronze, Titanium and Platinum.
- Accessories and cafe ingredients.
- Prices on the website are in USD.

## Services for businesses
- Open your first cafe: we have helped many independent coffee shop owners get started — equipment, beans and consulting.
- Barista training: courses that turn coffee enthusiasts into professional baristas (taste profiles, brewing techniques).
- Repair & maintenance: if a machine breaks down, call us — our technicians visit or bring it in for repair.
- Delivery: equipment delivered within Phnom Penh and to the provinces.
- Custom specialty blends for a cafe's signature taste.

## Quality
- Since 2015 our beans are certified by the Institute of Standards of Cambodia: free from chemicals, flavorings, preservatives and added coloring.
- 10+ years of experience serving business partners, 500+ happy customers, 100+ products.

## Founder
Ou Senghong, Founder & CEO. Started roasting coffee by hand in 1997 with a vision of growing Cambodia's coffee industry, working with local farmers and bringing Cambodian coffee to international markets.

## Contact & location
- Phone / sales line: {PHONE}
- Email: info@rattanakcoffee.com
- Address: #09 107BT, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh
- Hours: Monday – Saturday 8:00 AM – 5:00 PM. Closed Sunday.
- Facebook: https://www.facebook.com/rattanakcoffeeroaster
- Telegram: https://t.me/rattanak_coffee
- Instagram: https://www.instagram.com/rattanakcoffee/
- TikTok: https://www.tiktok.com/@rattanakcoffee
- Contact form on the website: /contact

## Ordering
{ORDERING}

## Shipping
- Orders are usually processed within 2–3 business days; delivery time depends on location.
- Free shipping on orders over $100. Orders under $100 have a $10 shipping fee.
- VAT is added at checkout.

## Returns & refunds
- Returns accepted within 30 days for unopened products in original packaging, with proof of purchase (order number or receipt). No return fees.
- Not returnable: opened coffee beans or ground coffee, perishable goods/ingredients, gift cards, final-sale items.
- Refunds are processed within 5–7 business days after inspection, to the original payment method (cash-on-delivery orders: bank transfer or store credit).
- Damaged or defective items are exchanged with priority; we cover the extra shipping.
- To start a return, contact us by phone or email with the order number.

## Website pages
Home /, All products /products, Machines /products/machines, Beans /products/beans,
Accessories /products/accessories, Ingredients /products/ingredients,
About /about, Business services /business, Gallery /gallery, Contact /contact,
Terms /terms, Privacy /privacy, Refund policy /refund.
`.trim();
