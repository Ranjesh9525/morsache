import mongoose, { Document } from 'mongoose';

interface Order extends Document {
    orderNumber: string;
    customer: mongoose.Schema.Types.ObjectId;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    shippingPrice?: number;
    paymentMethod: {
        type: 'creditCard' | 'razorPay' | 'stripe' | 'payOnDelivery';
        cardNumber?: string;
        cardExpiry?: string;
        cardCVV?: string;
    };
    paymentStatus: 'pending' | 'paid';
}
