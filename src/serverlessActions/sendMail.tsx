import { CartItem, CartItemForServer } from "@/@types/cart";
import { Order } from "@/@types/order";
import { Product } from "@/@types/products";
import { formatDate } from "date-fns";
import nodemailer from "nodemailer";
import { format } from "util";
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
  const url = process.env.NEXT_PUBLIC_BASE_URL ?  process.env.NEXT_PUBLIC_BASE_URL :"https://morsache.vercel.app"
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
                   <h2 style="color: #ffffff; margin: 0; font-size: 28px;display:flex;align-items:center;justify-content:center">                               <img src="${url}/morsache-clothing-logo-small.png" alt="Morsache Logo" style="display: block; width: 60px; height: 60px;">Morsache
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
                           <td>${order.expectedDeliveryOrPickupDate1 ?"Between " + formatDate(order?.expectedDeliveryOrPickupDate1, "PPP") + " - " + formatDate(order?.expectedDeliveryOrPickupDate2, "PPP") : "Calculated when order is confirmed"}</td>
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
                           <td style="text-align: right;">${format(
                             order.totalAmount
                           )}</td>
                       </tr>
                      ${
                        order.collectionMethod !== "pickup"
                          ? `<tr>
                           <td style="font-weight: bold;">Shipping:</td>
                           <td style="text-align: right;">${format(
                             order.shippingPrice
                           )}</td>
                       </tr>`
                          : ""
                      }
                       <tr style="font-size: 18px; font-weight: bold; color: #3b3838;">
                           <td>Total:</td>
                           <td style="text-align: right;">${format(
                             (order.totalAmount! as number) +
                               (order.shippingPrice &&
                               order.collectionMethod !== "pickup"
                                 ? (order.shippingPrice as number)
                                 : 0)
                           )}</td>
                       </tr>
                   </table>
   
                   <h3 style="color: #3b3838; margin-top: 30px;">What's Next?</h3>
                   <ol style="padding-left: 20px;">
                      <li>We'll send you a shipping confirmation email once your order is on its way.</li>
                       <li>You can track your order status by logging into your account on our website.</li>
                       <li>If you have any questions, please don't hesitate to contact our customer service team.</li>
                   </ol>
   
                   <h3 style="color: #3b3838; margin-top: 30px;">Return Policy</h3>
                   <p>Our return policy allows for returns within 7 days of the purchase date. The clothing must be unworn and in its original condition for a full refund.</p>
   
                   <p style="font-size: 16px; margin-top: 30px;">Thank you for choosing Morsache. We appreciate your business!</p>
               </td>
           </tr>
           <tr>
               <td style="background-color: #3b3838; color: #ffffff; padding: 20px; text-align: center;">
                   <p style="margin: 0 0 10px 0; font-size: 14px;">Follow us on social media:</p>
                   <a href="#" style="display: inline-block; margin: 0 10px;"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                   <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                   </svg></a>
                   <a href="#" style="display: inline-block; margin: 0 10px;"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                   <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fd5"></stop><stop offset=".328" stop-color="#ff543f"></stop><stop offset=".348" stop-color="#fc5245"></stop><stop offset=".504" stop-color="#e64771"></stop><stop offset=".643" stop-color="#d53e91"></stop><stop offset=".761" stop-color="#cc39a4"></stop><stop offset=".841" stop-color="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4168c9"></stop><stop offset=".999" stop-color="#4168c9" stop-opacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                   </svg></a>
                   <a href="#" style="display: inline-block; margin: 0 10px;"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                   <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"></path>
                   </svg></a>
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
