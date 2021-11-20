process.env.NODE_ENV = "test";
const app = require('../../apptest.js');
const supertest = require('supertest');
const request = supertest(app);
const dbFunction = require('../../testFunctions.js');
require('dotenv').config();

let addUsers = "INSERT INTO test_stats (Username, GP, Wins, Losses, Ties, Abandons, WinPerc, Password)" + 
                        "VALUES ('4th', 20, 5, 5, 5, 5, 33, 'password')," + 
                        "('8th', 0, 0, 0, 0, 0, 0, 'password')," +
                        "('6th', 10, 1, 0, 0, 9, 10, 'password')," +
                        "('7th', 30, 1, 0, 0, 29, 3, 'password')," +
                        "('2nd', 100, 49, 0, 0, 51, 50, 'password')," +
                        "('1st', 3, 3, 0, 0, 0, 100, 'password')," +
                        "('5th', 6, 2, 4, 0, 3, 33, 'password')," +
                        "('3rd', 10, 4, 6, 0, 0, 40, 'password');";

describe('userstats/1.0.0/leaderboard  -  Requesting leaderboard retrieval', () => {
    beforeAll(async () => {
        await dbFunction.setup(addUsers);    
    });

    afterAll(async () => {
        await dbFunction.breakdown();
    }); 

    test('Returns 200 status, and json object with correctly ordered leaderboard', async () => {
        const response = await request.get('/userstats/1.0.0/leaderboard').send();
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual('application/json');
        let objArray = [];
        let r = JSON.parse(response.text);
        for (i = 0; i < 8; i++){
            objArray.push(r.data[i].Username);
        }
        expect(objArray).toEqual(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']);
    })   
})