import { Listener, Subjects, TicketUpdatedEvent } from "@vsstickets/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = QueueGroupName.ORDERS_SERVICE

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const { title, price, version } = data;

        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error("Ticket not found!");

        }

        ticket.set({ title, price, version });
        await ticket.save();
        msg.ack();
    }

}