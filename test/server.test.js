const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const jwt = require('jsonwebtoken');

describe('Test Happy Hours End Points', function () {
    let db;
    let token = process.env.API_TOKEN

    let data = [{
        "weekstart": "2020-05-08",
        "totalhours": "15",
        "id": "99",
        "usid": "370fc2ab-714e-46fd-97bc-d18746e8f18e",
        "created": "2021-05-07 15:58:23",
        "day1": "0",
        "day1b": "0",
        "day2": "0",
        "day2b": "0",
        "day3": "0",
        "day3b": "0",
        "day4": "0",
        "day4b": "0",
        "day5": "0",
        "day5b": "0",
        "day6": "0",
        "day6b": "0",
        "day7": "0",
        "day7b": "0",
    }]


    before('Knex Instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    before('Sweep', () => db.raw('TRUNCATE TABLE testusersdata RESTART IDENTITY;'))

    afterEach('Sweep again', () => db.raw('TRUNCATE TABLE testusersdata RESTART IDENTITY;'))

    after('Disconnect from test table', () => db.destroy())


    describe('Test API Token', () => {
        it('No API Token', () => {
            return supertest(app)
                .get('/success')
                .expect(401)
        })
        it('With Api Token', () => {
            return supertest(app)
                .get(`/success/${data.usid}`)
                .set({"Authorization": `Bearer ${token}`})
                .expect(200)
        })
    })

    describe('Test Success Route', () => {
        beforeEach('Insert Test Data', () => {
            return db('testusersdata').insert(data)
        })

        it('Get test user data and status 200', () => {
            return supertest(app)
                .get(`/success/${data.usid}`)
                .set({"Authorization": `Bearer ${token}`})
                .expect(200)
        })
        it('Return 404 with bad user id', () => {
            return supertest(app)
                .get("/succcess/badid")
                .set({"Authorization": `Bearer ${token}`})
                .expect(404)
        })
        it('Post User data', () => {

            let newData = {
                "weekstart": "2020-05-08",
                "totalhours": "15",
                "id": "01",
                "usid": "370fc2ab-714e-46fd-97bc-d18746e8f18e",
                "created": "2021-05-07 15:58:23",
                "day1": "0",
                "day1b": "0",
                "day2": "0",
                "day2b": "0",
                "day3": "0",
                "day3b": "0",
                "day4": "0",
                "day4b": "0",
                "day5": "0",
                "day5b": "0",
                "day6": "0",
                "day6b": "0",
                "day7": "0",
                "day7b": "0",
            }

            return supertest(app)
                .post('/success/370fc2ab-714e-46fd-97bc-d18746e8f18e')
                .set({"Authorization": `Bearer ${token}`})
                .send(newData)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.a('object');
                })

        })
        
        it('Update user data', () => {
            let updateData = {
                "weekstart": "2020-05-08",
                "totalhours": "15",
                "id": "01",
                "usid": "370fc2ab-714e-46fd-97bc-d18746e8f18e",
                "created": "2021-05-07 15:58:23",
                "day1": "0",
                "day1b": "0",
                "day2": "0",
                "day2b": "0",
                "day3": "0",
                "day3b": "0",
                "day4": "0",
                "day4b": "0",
                "day5": "0",
                "day5b": "0",
                "day6": "0",
                "day6b": "0",
                "day7": "20",
                "day7b": "1000",
            }

            return supertest(app)
                .patch('/success/370fc2ab-714e-46fd-97bc-d18746e8f18e')
                .set({"Authorization": `Bearer ${token}`})
                .send(updateData)
                .expect(200)
                .then(res => {
                    supertest(app)
                        .get('/success/370fc2ab-714e-46fd-97bc-d18746e8f18e')
                        .set({"Authorization": `Bearer ${token}`})
                        .expect(updateData)
                })
        })

        it('Delete User Data', () => {
            const deleteData = {
                "id": "99"
            }

            return supertest(app)
                .delete('/success/370fc2ab-714e-46fd-97bc-d18746e8f18e')
                .set({"Authorization": `Bearer ${token}`})
                .send(deleteData)
                .expect(204)
        })
    })

    describe('Add User', () => {
        beforeEach('Delete Test User Data', () => db.raw("DELETE FROM users WHERE user_name='testme123';"))

        it('Add New User', () => {
            const newUser = {
                "user_name": "testme123",
                "user_email": "test123@test.com",
                "user_password": "testme123",
                "user_ovts": "40",

            }
            return supertest(app)
                .post('/create')
                .set({"Authorization": `Bearer ${token}`})
                .send(newUser)
                .expect(201)
        })
    })

    describe('Log in User', () => {

        it('Log In User', () => {
            const logInUser = {
                "user_name": "testme123",
                "user_password": "testme123",
            }
            return supertest(app)
                .post('/authentication')
                .set({"Authorization": `Bearer ${token}`})
                .send(logInUser)
                .expect(200)
        })

    })


})