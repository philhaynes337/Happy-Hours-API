const express = require('express');
const path = require('path');
const xss = require('xss');
const apiService = require('./apiService');

const successRoute = express.Router();
const jsonParser = express.json();


successRoute
    .route('/:userid')
    .all((req, res, next) => {
        
        const { userid } = req.params

        apiService.getByUserId(
            req.app.get('db'),
            userid
        )
        .then(data => {
            if (!data) {
                return res.status(404).send('User Not Found')
            }
            res.data = data
            res.json(res.data)
        })
        .catch(err => {
            res.status(404).send('error - user not found')
        })

    })


module.exports = successRoute