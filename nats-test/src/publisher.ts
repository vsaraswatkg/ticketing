import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });


stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: "id",
            title: "title",
            price: 23
        })
    } catch (e) {
        console.log(e);
    }


    // const event = JSON.stringify({
    //     id: "bleh",
    //     message: "blah"
    // });
    //
    // stan.publish("ticket:created", event, () => {
    //     console.log("Event published");
    // });
})

