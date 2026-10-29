import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'nonexistent@test.com',
            password: 'password',
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'wrongpassword',
        })
        .expect(400);
});

it('fails with 400 when missing email or password', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'invalid-email',
            password: 'password',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '',
        })
        .expect(400);
});

it('responds with a 200 and sets a cookie on successful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.body.email).toEqual('test@test.com');
});
