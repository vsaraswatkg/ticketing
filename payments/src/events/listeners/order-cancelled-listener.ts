import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@vsstickets/common";
import { QueueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = QueueGroupName.PAYMENTS_SERVICE;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!order) {
            throw new Error(`Could not find order with id: ${data.id}`);
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();
        msg.ack();
    }
}