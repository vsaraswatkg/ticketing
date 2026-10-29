import { Publisher, Subjects, TicketUpdatedEvent } from '@vsstickets/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}