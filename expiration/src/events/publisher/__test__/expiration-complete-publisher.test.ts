import { ExpirationCompletePublisher } from '../expiration-complete-publisher';
import { natsWrapper } from '../../../nats-wrapper';
import { Subjects } from '@vsstickets/common';

it('publishes an expiration:complete event with orderId', async () => {
    const publisher = new ExpirationCompletePublisher(natsWrapper.client);

    await publisher.publish({
        orderId: 'orderId_123',
    });

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

    const [subject, data] = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
    expect(subject).toEqual(Subjects.ExpirationComplete);

    const parsedData = JSON.parse(data);
    expect(parsedData.orderId).toEqual('orderId_123');
});
