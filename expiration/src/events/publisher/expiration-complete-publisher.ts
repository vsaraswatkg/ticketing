import { ExpirationCompleteEvent, Publisher, Subjects } from "@vsstickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}