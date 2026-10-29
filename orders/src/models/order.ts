import mongoose from "mongoose";
import { OrderStatus } from "@vsstickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus }

// Defined to create an order
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

// Defines what properties exist on the final document stores in mongo
// Some fields not necessarily need to create mongodb document
interface OrderDoc extends mongoose.Document {
    id: string;
    version: number;
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }

}, {
    optimisticConcurrency: true,
    versionKey: 'version',
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order } ;