const express = require('express');
const path = require('path');
const xss = require('xss');
const apiService = require('./apiService')
const cors = require('cors');
const createRoute = express.Router();
const jsonParser = express.json();
const {CLIENT_ORIGIN} = require('../config');

const corsOptions = {
    
    origin: {CLIENT_ORIGIN},
    optionsSuccessStatus: 200,
    method: '*',

}


createRoute
    .route('/')
    .get(cors(corsOptions), (req, res, next) => {
        apiService.getUsers(
            req.app.get('db')
        )
        .then(data => {
            res.json(data)
        })
        .catch(next)
    })
    .post(cors(corsOptions), jsonParser, (req, res, next) => {
            //console.log('got to post')
        const { user_name, user_email, user_password, user_ovts} = req.body;
        
        for (const field of ['user_name', 'user_email', 'user_password', 'user_ovts']) {
            if (!req.body[field]) {
                //console.log('Missing Something')
                return res.status(400).send({ error: { message: `'${field}' is required`}})
            }
        }

        apiService.checkUsers(
            req.app.get('db'),
            user_name,
            user_email
        )
        .then(checkUser => {
            if (checkUser)

                return res.status(400).json({ error: `User Name / Email is already taken`})

                return apiService.hashedPassword(user_password).then(hashedPassword => {
                    const createUser = {
                        user_name,
                        user_email,
                        user_password: hashedPassword,
                        user_ovts,
                        happyhours: 0,
                        superuser: 'no',
                        life_time_happyhours: 0,
                        happyhours_used: 0,
                    };
                    return apiService.addNewUser(
                        req.app.get('db'), 
                        createUser
                    )
                        .then(data => {
                            
                            res
                                .status(201)
                                .location(path.posix.join(req.originalUrl))
                                .send('User Added')
                                
                        })
                        .catch(next)
                })

        })
    })



module.exports = createRoute