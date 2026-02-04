import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderDate: string;
  trackingNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData,
) {
  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: "Rattanak Coffee Shop <orders@rattanakcoffee.com>",
      to: [data.customerEmail],
      subject: `Order Confirmation - Order #${data.orderId.substring(0, 8)}`,
      html: generateOrderConfirmationHTML(data),
    });

    if (error) {
      console.error("Email sending error:", error);
      return { success: false, error };
    }

    return { success: true, data: emailResult };
  } catch (error) {
    console.error("Email sending exception:", error);
    return { success: false, error };
  }
}

function generateOrderConfirmationHTML(
  data: OrderConfirmationEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #5F1B2C;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 30px 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .order-summary {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .total {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-weight: bold;
            font-size: 1.2em;
            color: #5F1B2C;
            margin-top: 10px;
          }
          .tracking-box {
            background-color: #FEF3C7;
            border: 2px solid #F59E0B;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .tracking-number {
            font-size: 1.3em;
            font-weight: bold;
            color: #92400E;
            font-family: monospace;
            letter-spacing: 1px;
          }
          .button {
            display: inline-block;
            background-color: #5F1B2C;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 0.9em;
          }
          .info-label {
            color: #6b7280;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0;">Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0;">Order #${data.orderId.substring(0, 8)}</p>
        </div>
        
        <div class="content">
          <p>Hi ${data.customerName},</p>
          <p>We've received your order and we're getting it ready. We'll notify you when it ships.</p>
          
          <div class="tracking-box">
            <p class="info-label" style="margin: 0 0 5px 0;">Your Tracking Number</p>
            <p class="tracking-number" style="margin: 0;">${data.trackingNumber}</p>
          </div>
          
          <div class="order-summary">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p class="info-label">Order Date: ${new Date(data.orderDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            
            <div style="margin: 20px 0;">
              ${data.items
                .map(
                  (item) => `
                <div class="item">
                  <div>
                    <strong>${item.name}</strong>
                    <div class="info-label">Qty: ${item.quantity}</div>
                  </div>
                  <div>$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div style="margin-top: 20px; padding-top: 10px; border-top: 2px solid #e5e7eb;">
              <div class="item" style="border: none;">
                <span>Subtotal:</span>
                <span>$${data.subtotal.toFixed(2)}</span>
              </div>
              <div class="item" style="border: none;">
                <span>Tax (10% VAT):</span>
                <span>$${data.tax.toFixed(2)}</span>
              </div>
              <div class="item" style="border: none;">
                <span>Shipping:</span>
                <span>${data.shipping === 0 ? "FREE" : `$${data.shipping.toFixed(2)}`}</span>
              </div>
              <div class="total">
                <span>Total:</span>
                <span>$${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Shipping Address</h3>
            <p>${data.shippingAddress}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Payment Method</h3>
            <p>Cash on Delivery</p>
            <p class="info-label">Please prepare exact amount: <strong>$${data.total.toFixed(2)}</strong></p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://rattanak-coffee-shop.vercel.app" class="button">View Order Status</a>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em;">
            If you have any questions about your order, please contact us at 
            <a href="mailto:support@rattanakcoffee.com" style="color: #5F1B2C;">support@rattanakcoffee.com</a>
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Rattanak Coffee Shop. All rights reserved.</p>
          <p>123 Coffee Street, Bean City, BC 12345</p>
        </div>
      </body>
    </html>
  `;
}
