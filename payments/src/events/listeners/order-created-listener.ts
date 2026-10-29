import { Listener, OrderCreatedEvent, Subjects } from "@vsstickets/common";
import { QueueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = QueueGroupName.PAYMENTS_SERVICE;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const existingOrder = await Order.findById(data.id);
        if (existingOrder) {
            throw new Error(`An order already exists with orderId ${data.id}`);
        }

        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            status: OrderStatus.Created,
            price: data.ticket.price
        });

        await order.save();
        msg.ack();
    }
}