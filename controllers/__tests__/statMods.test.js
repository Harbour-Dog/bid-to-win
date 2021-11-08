process.env.NODE_ENV = "test";
const app = require('../../apptest.js');
const supertest = require('supertest');
const request = supertest(app);
const dbFunction = require('../../testFunctions.js');
require('dotenv').config();

console.log(process.env.BASE_URL);

let addUsers = "INSERT INTO test_stats (Username, GP, Wins, Losses, Ties, Abandons, WinPerc, Password)" + 
                "VALUES ('userGame_Start', 0, 0, 0, 0, 0, 0, 'passGame_Start')," +
                "('userGame_Win', 10, 1, 0, 0, 9, 10, 'passGame_Win')," +
                "('userGame_Loss', 4, 1, 2, 0, 1, 33, 'passGame_Loss')," +
                "('userGame_Tie', 100, 49, 50, 0, 1, 50, 'passGame_Tie');";

describe('/user/1.0.0  -  During gameplay,', () => {
    beforeAll(async () => {
        await dbFunction.setup(addUsers);    
    });

    afterAll(async () => {
        await dbFunction.breakdown();
    })

    test('starting a new game should return a 200 status.', async () => {
        const response = await request.put('/user/1.0.0/game_started').send({
            Username: 'userGame_Start'
        })
        expect(response.statusCode).toBe(200);
    })
    test('starting a new game with unregistered username returns 400, and corresponding message', async () => {
        const response = await request.put('/user/1.0.0/game_started').send({
            Username: 'userFalse'
        })
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
    })
    test('starting a new game adds exactly 1 GP and 1 Abandon to the database for the user.', async () => {
        const response = await request.get('/user/1.0.0/:Username/:Password').query({Username: 'userGame_Start', Password: 'passGame_Start'}).send();
        let r = JSON.parse(response.text).data[0];
        expect([r.GP, r.Wins, r.Losses, r.Ties, r.Abandons, r.WinPerc]).toEqual([1, 0, 0, 0, 1, 0]);
    })
    test('winning a game returns a 200 status.', async () => {
        const response = await request.put('/user/1.0.0/win').send({
            Username: 'userGame_Win',
            WinPerc: 20
        })
        expect(response.statusCode).toBe(200);
    })
    test('winning a game with unregistered username returns a 400 status, and corresponding message.', async () => {
        const response = await request.put('/user/1.0.0/win').send({
            Username: 'userFalse'
        })
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
    })
    test('Exactly 1 Win is added to, 1 Abandon subtracted from, and an update to the WinPerc made, when the user wins.', async () => {
        const response = await request.get('/user/1.0.0/:Username/:Password').query({Username: 'userGame_Win', Password: 'passGame_Win'}).send();
        let r = JSON.parse(response.text).data[0];
        expect([r.GP, r.Wins, r.Losses, r.Ties, r.Abandons, r.WinPerc]).toEqual([10, 2, 0, 0, 8, 20]);
    })
    test('losing a game returns a 200 status', async () => {
        const response = await request.put('/user/1.0.0/loss').send({
            Username: 'userGame_Loss',
            WinPerc: 25
        })
        expect(response.statusCode).toBe(200);
    })
    test('losing a game with an unregistered username returns a 400 status and corresponding message.', async () => {
        const response = await request.put('/user/1.0.0/loss').send({
            Username: 'userFalse'
        })
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
    })
    test('Exactly 1 Loss is added to, 1 Abandon subtracted from, and an update to the WinPerc made, when user loses.', async () => {
        const response = await request.get('/user/1.0.0/:Username/:Password').query({Username: 'userGame_Loss', Password: 'passGame_Loss'}).send();
        let r = JSON.parse(response.text).data[0];
        expect([r.GP, r.Wins, r.Losses, r.Ties, r.Abandons, r.WinPerc]).toEqual([4, 1, 3, 0, 0, 25]);  
    })      
    test('tieing a game returns a 200 status.', async () => {
        const response = await request.put('/user/1.0.0/tie').send({
            Username: 'userGame_Tie',
            WinPerc: 50
        })
        expect(response.statusCode).toBe(200);
    })
    test('tieing a game with an unregistered username returns a 400 status and corresponding message.', async () => {
        const response = await request.put('/user/1.0.0/tie').send({
            Username: 'userFalse'
        })
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json');
        expect(JSON.parse(response.text).data[0].msg).toEqual("No login detected.");
    })
    test('Exactly 1 Tie is added to, 1 Abandon subtracted from, and an update to the WinPerc made when user ties.', async () => {
        const response = await request.get('/user/1.0.0/:Username/:Password').query({Username: 'userGame_Tie', Password: 'passGame_Tie'}).send();
        let r = JSON.parse(response.text).data[0];
        expect([r.GP, r.Wins, r.Losses, r.Ties, r.Abandons, r.WinPerc]).toEqual([100, 49, 50, 1, 0, 50]);            
    })
})