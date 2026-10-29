import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/ticket";

it('it has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
});

it('it can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
});

it('it returns status other than 401 if user is signed in', async () => {
    const response = await request(app).post('/api/tickets').set("Cookie", global.signin()).send({});
    expect(response.status).not.toEqual(401);
});

it('it returns an error if an invalid title is provided', async () => {
    await request(app).post('/api/tickets').set("Cookie", global.signin()).send({
        title: '',
        price: 10
    }).expect(400);

    await request(app).post('/api/tickets').set("Cookie", global.signin()).send({
        price: 10
    }).expect(400);
});

it('it returns an error if an invalid price is provided', async () => {
    await request(app).post('/api/tickets').set("Cookie", global.signin()).send({
        title: 'aslkdfasdklfj',
        price: -10
    }).expect(400);

    await request(app).post('/api/tickets').set("Cookie", global.signin()).send({
        title: 'aslkdfasdklfj'
    }).expect(400);

});
it('it creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app).post('/api/tickets').set("Cookie", global.signin()).send({
        title: 'aslkdfasdklfj',
        price: 20
    }).expect(201);

    const result = await Ticket.findOne({
        title: 'aslkdfasdklfj',
        price: 20
    })
    
    expect(result).not.toBeNull();
});