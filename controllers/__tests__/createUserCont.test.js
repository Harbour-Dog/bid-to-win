process.env.NODE_ENV = "test";
const app = require('../../apptest.js');
const supertest = require('supertest');
const request = supertest(app);
const dbFunction = require('../../testFunctions.js');
require('dotenv').config();

let addUsers = "INSERT INTO test_stats (Username, GP, Wins, Losses, Ties, Abandons, WinPerc, Password)" + 
                "VALUES ('createBlock', 0, 0, 0, 0, 0, 0, 'password');"; 

describe('user/1.0.0/create  -  Attempting to create a user', () => {
    beforeAll(async () => {
        await dbFunction.setup(addUsers);
    });

    afterAll(async () => {
        await dbFunction.breakdown();
    });
    
    test('correctly, returns a 200 status with a json content-type.', async () => {
        const response = await request.post('/user/1.0.0/create').send({
            Username: 'userCreate',
            Password: 'passCreate'
        })
        expect(response.type).toEqual('application/json');
        expect(response.statusCode).toBe(200);
    })
    test('when the username already exists, returns a 400 status, and corresponding message.', async () => {
        const response = await request.post('/user/1.0.0/create').send({
            Username: 'createBlock',
            Password: 'password'
        })
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].msg).toEqual("Username already exists");
    })
    test('correctly, adds the user to the database,', async () => {
        const response = await request.post('/user/1.0.0/create').send({
            Username: 'userCreate',
            Password: 'password'
        })
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].msg).toEqual("Username already exists");
    })
})







