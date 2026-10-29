import { OrderCancelledEvent, Publisher, Subjects } from "@vsstickets/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}