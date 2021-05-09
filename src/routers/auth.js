const express = require('express');
const path = require('path');
const xss = require('xss');
const apiService = require('./apiService');
const cors = require('cors');
const authRouter = express.Router();
const jsonParser = express.json();
const {CLIENT_ORIGIN} = require('../config');

const corsOptions = {
    
        origin: {CLIENT_ORIGIN},
        optionsSuccessStatus: 200,
        method: '*',
    
}


authRouter
    .route('/')
    .get(cors(corsOptions), (req, res, next) => {
        res.send('Nothing to see here')
    })
    .post(cors(corsOptions), jsonParser, (req, res, next) => {
        const { user_name, user_password } = req.body;
        const loggedInUser = { user_name, user_password}

        for (const [key, value] of Object.entries(loggedInUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });

        apiService.authGetName(
            req.app.get('db'),
            loggedInUser.user_name
            )
            .then(data => {
                if (!data)
                    return res.status(400).json({
                        error: 'Incorrect User NAME or Password'
                    });

                    return apiService.checkPasswords(
                        user_password,
                        data.user_password
                    )
                    .then(check => {
                        
                        if (!check)
                        
                            return res.status(401).json({
                                error: 'Incorrect User Name or PASSWORD'
                            });

                            const sub = data.user_name;
                            const payload = { user_id: data.id }

                            res.send({
                                authToken: apiService.createToken(sub, payload),
                                userid: data.id
                            });

                    });
            })
            .catch(next)
        
    })

    module.exports = authRouter