import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@vsstickets/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    readonly queueGroupName = QueueGroupName.ORDERS_SERVICE

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const { orderId } = data;

        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new Error("Could not find order")
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        msg.ack();
    }

}