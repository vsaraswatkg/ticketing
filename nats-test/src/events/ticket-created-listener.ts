import { Listener, Subjects, TicketCreatedEvent } from "../../../common/src";
import { Message } from "node-nats-streaming";

export class TicketCreateListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log("Event data received", data);
        msg.ack();
    }
}