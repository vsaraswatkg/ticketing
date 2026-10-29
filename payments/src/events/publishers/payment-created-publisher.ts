import { PaymentCreatedEvent, Publisher, Subjects } from "@vsstickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}