process.env.NODE_ENV = "test";
const app = require('../../apptest.js');
const supertest = require('supertest');
const request = supertest(app);
const dbFunction = require('../../testFunctions.js');
require('dotenv').config();

let addUsers = "INSERT INTO test_stats (Username, GP, Wins, Losses, Ties, Abandons, WinPerc, Password)" + 
                    "VALUES ('userGP_Rank', 12, 3, 9, 0, 0, 25, 'passGP_Rank')," +
                    "('userWins_Rank', 6, 5, 4, 0, 3, 33, 'passWins_Rank')," +
                    "('userWin%_Rank', 10, 4, 6, 0, 0, 40, 'passWin%_Rank');";

describe('userstats/1.0.0/*STAT*rank/:Username  -  Requesting the rank of the user', () => {
    beforeAll(async () => {
        await dbFunction.setup(addUsers);    
    });

    afterAll(async () => {
        await dbFunction.breakdown();
    });

    test('when it is the GP, correctly, returns 200 status and a json object with correct GP rank.', async () => {
        const response = await request.get('/userstats/1.0.0/gprank/:Username').query({Username: 'userGP_Rank'}).send();
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].row_num).toEqual(1);
    })
    test('when it is the GP, when not logged in, returns a 400 status, corresponding message, and no user rank object.', async () => {
        const response = await request.get('/userstats/1.0.0/gprank/:Username').query({Username: ''}).send();
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
        expect(JSON.parse(response.text).data.length).toEqual(1);
    })
    test('when it is the GP, but username is not in the database, returns a 400 status, corresponding message, and no user rank object.', async () => {
        const response = await request.get('/userstats/1.0.0/gprank/:Username').query({Username: 'userFalse'}).send();
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
        expect(JSON.parse(response.text).data.length).toEqual(1);
    })
    test('when it the Wins, correctly, returns 200 status and a json object with correct Wins rank.', async () => {
        const response = await request.get('/userstats/1.0.0/winsrank/:Username').query({Username: 'userWins_Rank'}).send();
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].row_num).toEqual(1);
    })
    test('when it is the Wins, but user is not logged in, returns a 400 status, corresponding message, and no user rank object.', async () => {
        const response = await request.get('/userstats/1.0.0/winsrank/:Username').query({Username: ''}).send();
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
        expect(JSON.parse(response.text).data.length).toEqual(1);
    })
    test('when it is the Wins, but username is not in the database, returns a 400 status, corresponding message, and no user rank object.', async () => {
        const response = await request.get('/userstats/1.0.0/winsrank/:Username').query({Username: 'userFalse'}).send();
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
        expect(JSON.parse(response.text).data.length).toEqual(1);
    })
    test('when it is the Win%, correctly, returns 200 status and a json object with correct Win Percentage rank.', async () => {
        const response = await request.get('/userstats/1.0.0/winperrank/:Username').query({Username: 'userWin%_Rank'}).send();
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].row_num).toEqual(1);
    })
    test('when it is the W%, but user is not logged in, returns a 400 status, corresponding message, and no user rank object.', async () => {
        const response = await request.get('/userstats/1.0.0/winperrank/:Username').query({Username: ''}).send();
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
        expect(JSON.parse(response.text).data.length).toEqual(1);
    })
    test('when it is the Win%, but username is not in the database, returns a 400 status, corresponding message, and no user rank object.', async () => {
        const response = await request.get('/userstats/1.0.0/winperrank/:Username').query({Username: 'userFalse'}).send();
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
        expect(JSON.parse(response.text).data.length).toEqual(1);
    })
})