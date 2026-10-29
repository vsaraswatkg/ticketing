import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('return a 404 if the ticket is not found', async () => {
    await request(app).get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .send().expect(404);
})

it('return a the ticket if ticket is found', async () => {
    const title = "hello";
    const price = 20;

    const response = await request(app).post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title, price }).expect(201);


    const ticketResp = await request(app).get(`/api/tickets/${response.body.id}`)
        .send().expect(200);

    expect(ticketResp.body.title).toEqual(title);
    expect(ticketResp.body.price).toEqual(price);
})