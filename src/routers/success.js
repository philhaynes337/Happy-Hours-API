const express = require('express');
const path = require('path');
const xss = require('xss');
const apiService = require('./apiService');
const cors = require('cors');
const successRoute = express.Router();
const jsonParser = express.json();
const {CLIENT_ORIGIN} = require('../config');


const corsOptions = {
    
    origin: {CLIENT_ORIGIN},
    optionsSuccessStatus: 200,
    method: '*',

}

successRoute
    .route('/')
    .post(cors(corsOptions), jsonParser, (req, res, next) => {
        const { usid, token} = req.body;
        const data = {usid, token}

        apiService.loggedin(
            req.app.get('db'),
            data
        )
        .then(res.send('User Event Logged'))
        .catch(error => {
            console.log(error)
            res
            .status(404)
            .send({message: `Error During Event Logging`})
        })

    })

successRoute
    .route('/stepfour')
    .patch(cors(corsOptions), jsonParser, (req, res, next) => {

        const { happyhours_used, id } = req.body;

        //console.log('Happhours: ' + happyhours_used)
        //console.log('Happ Hours Id: ' + id)

        apiService.updateHappyHoursUsed(
            req.app.get('db'),
            id,
            happyhours_used
        )
        .then(res.send('Updated Happy Hours Used'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error UpdatingHappy Hours Used`})
        })
    })

successRoute
    .route('/stepthree')
    .all(cors(corsOptions), jsonParser, (req, res, next) => {
        const { id } = req.body;
        //console.log(id)
        apiService.getHappyHoursData(
            req.app.get('db'),
            id,
            )
            .then(hours => {
                //console.log(hours)
                if (!hours) {
                    return res.status(404).send('Happy Hours Not Found')
                }
                
                res.hours = hours
                res.json(res.hours)
            })
            .catch(error => {
                console.log(error)
                res
                    .status(404)
                    .send({message: `Error Sending Happy Hours`})
            })
    })
   


successRoute
    .route('/steptwo')
    .patch(cors(corsOptions), jsonParser, (req, res, next) => {
        //console.log('getting to step2')
        const { id, life_time_happyhours } = req.body;

        const usidH = { id }
        const sumOfHappyHoursH = {life_time_happyhours}

        //console.log('success js: ' + sumOfHappyHours)
        //console.log(req.body)

        apiService.addHappyHours(
            req.app.get('db'),
            usidH,
            sumOfHappyHoursH,
        )
        .then(res.send('Updated Life Time Happy Hours'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error Updating Life Time Happy Hours`})
        })
    })
    .delete(cors(corsOptions), jsonParser, (req, res, next) => {
        const { usid } =  req.body

        apiService.apiLogout(
            req.app.get('db'),
            usid
        )
        .then(res.status(204).send('Logged Out From API'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error while logging out of API!`})
        })
    })

successRoute
    .route('/step')
    .all(cors(corsOptions), jsonParser, (req, res, next) => {

        const { token } = req.body;

        apiService.getIdByToken(
            req.app.get('db'),
            token,
        )
        .then(usid => {
            if (!usid) {
                return res.status(404).send('USID Not Found')
            }
            res.send({usid: usid})
        })
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error Looking up USID With Token`})
        })

        
    })

successRoute
    .route('/:userid')
    .get(cors(corsOptions), (req, res, next) => {
        
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
    .delete(cors(corsOptions), jsonParser, (req, res, next) => {
        //console.log('At Delete')
        const { id } = req.body;
        const deleteId = { id }

        //console.log('Delete id: ' + id)

        apiService.deleteEntry(
            req.app.get('db'),
            deleteId,
        )
        .then(res.status(204).send('Entry Deleted'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error while deleting entry!`})
        })
    })
    .post(cors(corsOptions), jsonParser, (req, res, next) => {

        const { usid,
                weekstart,
                totalhours,
                day1,
                day2,
                day3,
                day4,
                day5,
                day6,
                day7,
                day1b,
                day2b,
                day3b,
                day4b,
                day5b,
                day6b,
                day7b,
                } = req.body;

        //const newEntryUsid = {usid}

        const newEntry = { 
            weekstart,
            usid,
            totalhours,
            day1,
            day2,
            day3,
            day4,
            day5,
            day6,
            day7,
            day1b,
            day2b,
            day3b,
            day4b,
            day5b,
            day6b,
            day7b,
            }
            //console.log('Success JS USID: ' + newEntryUsid)
        apiService.addEntry(
            req.app.get('db'),
            //usid,
            newEntry,
        )
        .then(res.send('New Entry Added'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error Adding New Entry`})
        })

    })
    .patch(cors(corsOptions), jsonParser, (req, res, next) => {

        const { 
            id,
            usid, 
            weekstart, 
            totalhours,
            day1,
            day1b,
            day2,
            day2b,
            day3,
            day3b,
            day4,
            day4b,
            day5,
            day5b,
            day6,
            day6b,
            day7,
            day7b,
        } = req.body;

        const updateID = { id }

        const updateUserID = { usid }

        const updateData = {
            weekstart, 
            totalhours,
            day1,
            day1b,
            day2,
            day2b,
            day3,
            day3b,
            day4,
            day4b,
            day5,
            day5b,
            day6,
            day6b,
            day7,
            day7b,
        }
   

        apiService.updateEntry(
            req.app.get('db'),
            updateID,
            updateData,
            updateUserID
        )
        
        .then(res.status(200).send('Entry Updated Succesfully'))
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .send({message: `Error while updating entry!`})
        })


    })


module.exports = successRoute