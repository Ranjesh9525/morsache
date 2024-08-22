import nodemailer from "nodemailer";

export const sendOrderConfirmationEmail = (
  order: any,
  recipient: string,
  subject: string
) => {
  const server = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(server);

  // Email content
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: recipient, // Replace with the recipient's email
    subject: subject,
    html: `
    <p style="font-family: Arial, sans-serif; font-size: 18px; color: #333;">Dear Customer,</p>
    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555;">Your order with order number ${order.orderNumber} has been placed and is awaiting confirmation.</p>
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
      console.log("Email sent:", info.response);
    }
  });
};
