import { OrderCreatedEvent } from '@vsstickets/common';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { expirationQueue } from '../../../queue/expiration-queue';

jest.mock('../../../queue/expiration-queue');

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: 'orderId_123',
        version: 0,
        userId: 'userId_456',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        ticket: {
            id: 'ticketId_789',
            price: 20,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('adds a job to the expiration queue with correct orderId and delay', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(expirationQueue.add).toHaveBeenCalledTimes(1);
    expect(expirationQueue.add).toHaveBeenCalledWith(
        {
            orderId: data.id,
        },
        expect.objectContaining({
            delay: expect.any(Number),
        })
    );

    const delayArg = (expirationQueue.add as jest.Mock).mock.calls[0][1].delay;
    expect(delayArg).toBeGreaterThan(0);
});

it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});
