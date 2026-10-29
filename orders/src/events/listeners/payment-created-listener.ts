import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@vsstickets/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    readonly queueGroupName = QueueGroupName.ORDERS_SERVICE

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const { orderId } = data;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error("Order not found!");

        }
        order.set({
            status: OrderStatus.Complete
        })
        await order.save();
        msg.ack();
    }

}