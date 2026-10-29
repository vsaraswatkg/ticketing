import mongoose from "mongoose";


// Defined to create an order
interface PaymentAttrs {
    orderId: string;
    stripeId: string;

}

// Defines what properties exist on the final document stores in mongo
// Some fields not necessarily need to create mongodb document
interface PaymentDoc extends mongoose.Document {
    id: string;
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        require: true
    }

}, {
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
}


const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment } ;