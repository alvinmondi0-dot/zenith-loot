import { Order } from '../types';

export const sendOrderConfirmationEmail = async (email: string, order: Order): Promise<void> => {
  // In a real application, this would make an API call to a backend service 
  // (e.g., SendGrid, AWS SES) to send the email.
  
  console.group(`📧 [Zenith Loot] Sending Order Confirmation`);
  console.log(`To: ${email}`);
  console.log(`Subject: Order Confirmation #${order.id}`);
  console.log(`Date: ${order.date}`);
  console.log('--------------------------------------------------');
  console.log(`Hi ${order.userName},`);
  console.log(``);
  console.log(`Thank you for your purchase at Zenith Loot!`);
  console.log(``);
  console.log(`Order Details:`);
  console.log(`Game: ${order.gameName}`);
  console.log(`Item: ${order.amount}`);
  console.log(`Total: $${order.price.toFixed(2)}`);
  console.log(`Payment Method: ${order.paymentMethod}`);
  console.log(`Transaction ID: ${order.id}`);
  console.log(``);
  console.log(`Your top-up has been processed and delivered.`);
  console.log(`Need help? Contact support@zenithloot.com`);
  console.log('--------------------------------------------------');
  console.groupEnd();
  
  // Simulate network delay
  return new Promise(resolve => setTimeout(resolve, 800));
};