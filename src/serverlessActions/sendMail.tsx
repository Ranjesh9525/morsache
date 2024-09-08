import { CartItem, CartItemForServer } from "@/@types/cart";
import { Order } from "@/@types/order";
import { Product } from "@/@types/products";
import { formatDate } from "date-fns";
import nodemailer from "nodemailer";
import { UserUpdateShippingAddress } from "./_userActions";
const senderName = process.env.SMTP_FROM_NAME;
const senderEmail = process.env.SMTP_FROM;
const sender = `"${senderName}" <${senderEmail}>`;

export const sendOrderConfirmationEmail = (
  order: Order,
  recipient: string,
  subject: string,
  context: string,
  items: { item: CartItemForServer; product: Product }[],
  user_name: string
) => {
  const server = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.MAIL_SECURE === "true",
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(server);
  const allProducts = items.map(
    (i, index) =>
      ` <tr key=${index} style="border-bottom: 1px solid #ddd;">
         <td>
             <table cellpadding="5" cellspacing="0">
                 <tr>
                     <td>
                         <img src=${i.product!.images[0]} alt=${
        i.product!.name
      } style="width: 60px; height: 60px; object-fit: cover;">
                     </td>
                     <td>
                         <strong>${i.product!.name}</strong><br>
                         <strong>Size${i.item.size}</strong><br>
                        ${i.product!.description.substring(0, 50)}...
                     </td>
                 </tr>
             </table>
         </td>
         <td style="text-align: right;">${i.item.quantity}</td>
         <td style="text-align: right;">${
           i.item.discountedPrice
             ? i.item.discountedPrice.toFixed(2)
             : i.item.totalPrice.toFixed(2)
         }</td>
     </tr>`
  );
  const textd =
    "Thank you for your order with Morsache. Were excited to confirm that your order has been successfully placed and is being processed.";
  const htmlTemplate = `
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Your Order Has Been Placed - Morsache</title>
   </head>
   <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
       <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
         
           <tr>
               <td style="padding: 40px 20px; text-align: center; background-color: #6a6a6a;">
                   <h2 style="color: #ffffff; margin: 0; font-size: 28px;display:flex;align-items:center;justify-content:center">                               <img src="https://morsache.vercel.app/morsache-clothing-small-logo.png" alt="Morsache Logo" style="display: block; width: 60px; height: 60px;">Morsache
                   </h2>
               </td>
           </tr>
           <tr>
               <td style="padding: 20px;">
                   <p style="font-size: 16px;">Hello ${user_name || ""}🖐,</p>
                   <p style="font-size: 16px;">${context}</p>
                   
                   <h2 style="color: #3b3838; border-bottom: 2px solid #3b3838; padding-bottom: 10px;">Order Details</h2>
                   <table cellpadding="5" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                       <tr>
                           <td style="font-weight: bold;">Order Number:</td>
                           <td>${order.orderNumber}</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Total Items:</td>
                           <td>${order.totalItems}</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Order Status:</td>
                           <td>${order.orderStatus}</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Expected Delivery/Pickup:</td>
                           <td>Between${formatDate(
                             order.expectedDeliveryOrPickupDate1!,
                             "PPP"
                           )} - ${formatDate(
    order.expectedDeliveryOrPickupDate2!,
    "PPP"
  )}</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Collection Method:</td>
                           <td>${order.collectionMethod}</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Payment Method:</td>
                           <td>${
                             order.paymentMethod.type === "payOnDelivery"
                               ? order.collectionMethod === "pickup"
                                 ? "Pay on collection"
                                 : "Pay on delivery"
                               : order.paymentMethod.type === "stripe"
                               ? "stripe"
                               : "Razor pay"
                           }</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Payment Status:</td>
                           <td>${order.paymentStatus}</td>
                       </tr>
                   </table>
   
                  ${
                    order.shippingAddress.city ||
                    (order.shippingAddress.state &&
                      `<h3 style="color: #3b3838;">Shipping Address</h3>
                   <p>
                       ${order.shippingAddress.street}<br>
                       ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                       ${order.shippingAddress.country}
                   </p>`)
                  }
                   <h3 style="color: #3b3838;">Ordered Products</h3>
                   <table cellpadding="10" cellspacing="0" width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
                       <tr style="background-color: #f0f0f0;">
                           <th style="text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                           <th style="text-align: right; border-bottom: 1px solid #ddd;">Quantity</th>
                           <th style="text-align: right; border-bottom: 1px solid #ddd;">Price</th>
                       </tr>
                      ${allProducts.join()}
                   </table>
   
                   <table cellpadding="5" cellspacing="0" width="100%" style="margin-top: 20px; background-color: #f9f9f9; border-radius: 4px;">
                       <tr>
                           <td style="font-weight: bold;">Subtotal:</td>
                           <td style="text-align: right;">${
                             order.totalAmount
                           }</td>
                       </tr>
                       <tr>
                           <td style="font-weight: bold;">Shipping:</td>
                           <td style="text-align: right;">${
                             order.shippingPrice
                           }</td>
                       </tr>
                       <tr style="font-size: 18px; font-weight: bold; color: #3b3838;">
                           <td>Total:</td>
                           <td style="text-align: right;">${
                             (order.totalAmount! as number) +
                             (order.shippingPrice
                               ? (order.shippingPrice as number)
                               : 0)
                           }</td>
                       </tr>
                   </table>
   
                   <h3 style="color: #3b3838; margin-top: 30px;">What's Next?</h3>
                   <ol style="padding-left: 20px;">
                       <li>We'll send you a shipping confirmation email once your order is on its way.</li>
                       <li>You can track your order status by logging into your account on our website.</li>
                       <li>If you have any questions, please don't hesitate to contact our customer service team.</li>
                   </ol>
   
                   <h3 style="color: #3b3838; margin-top: 30px;">Return Policy</h3>
                   <p>{exchangeAndReturnPolicy}</p>
   
                   <h3 style="color: #3b3838; margin-top: 30px;">Additional Information</h3>
                   <p>{moreInformation}</p>
   
                   <p style="font-size: 16px; margin-top: 30px;">Thank you for choosing Morsache. We appreciate your business!</p>
               </td>
           </tr>
           <tr>
               <td style="background-color: #3b3838; color: #ffffff; padding: 20px; text-align: center;">
                   <p style="margin: 0 0 10px 0; font-size: 14px;">Follow us on social media:</p>
                   <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" style="width: 30px; height: 30px;"></a>
                   <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000" alt="Twitter" style="width: 30px; height: 30px;"></a>
                   <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" alt="Instagram" style="width: 30px; height: 30px;"></a>
                   <p style="margin: 20px 0 0 0; font-size: 12px;">&copy; 2024 Morsache. All rights reserved.</p>
               </td>
           </tr>
       </table>
   </body>
   </html>
   
   `;
  // Email content
  const mailOptions = {
    from: sender,
    to: recipient,
    subject: subject,
    html:
      htmlTemplate ||
      `
    <p style="font-family: Arial, sans-serif; font-size: 18px; color: #333;">Dear Customer,</p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555;">} ${context}.</p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555;">Order Details:</p>
    <ul>
        <li style="font-family: Arial, sans-serif; font-size: 14px; color: #777;">Total Items: ${order.totalItems}</li>
        <li style="font-family: Arial, sans-serif; font-size: 14px; color: #777;">Total Amount: ${order.totalAmount}</li>
        <li style="font-family: Arial, sans-serif; font-size: 14px; color: #777;">Shipping Address: ${order.shippingAddress}</li>
        <li style="font-family: Arial, sans-serif; font-size: 14px; color: #777;">Payment Method: ${order.paymentMethod.type}</li>
    </ul>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555;">Thank you for shopping with us!</p>

        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(
        "Email sent:",
        `${process.env.NEXT_PUBLIC_BASE_URL}/morsache-clothing-logo.png`
      );
    }
  });
};
