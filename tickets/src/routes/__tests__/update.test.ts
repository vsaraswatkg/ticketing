import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('returns 404 if the provided id does not exist', async () => {
    await request(app).put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .send({
            title: "asdalksd",
            price: 20
        }).expect(404);
})

it('returns 401 if the user is not authenticated', async () => {
    await request(app).put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .send({
            title: "asdalksd",
            price: 20
        }).expect(401);
})

it('returns 401 if the user does not own the ticket', async () => {
    const response = await request(app).post("/api/tickets")
        .set('Cookie', global.signin())
        .send({
            title: "asdalksd",
            price: 20
        });

    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: "asdalksdsfasd",
            price: 20
        }).expect(401);

})
it('returns 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app).post("/api/tickets")
        .set('Cookie', global.signin())
        .send({
            title: "asdalksd",
            price: 20
        });


    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "",
            price: 20
        }).expect(400);

    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "aasd",
            price: -1
        }).expect(400);
})
it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app).post("/api/tickets")
        .set('Cookie', cookie)
        .send({
            title: "asdalksd",
            price: 20
        });


    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "update",
            price: 100
        }).expect(200);


    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie).send();

    expect(ticketResponse.body.title).toEqual('update');
    expect(ticketResponse.body.price).toEqual(100);
})