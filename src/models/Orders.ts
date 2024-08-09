import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'debit card', 'paypal', 'cash on delivery']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },

},{timestamps:true});


export default mongoose.models.Orders = mongoose.model('Order', orderSchema);
