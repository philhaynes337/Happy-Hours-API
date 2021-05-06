const express = require('express');
const path = require('path');
const xss = require('xss');
const apiService = require('./apiService');

const successRoute = express.Router();
const jsonParser = express.json();


successRoute
    .route('/')
    .post(jsonParser, (req, res, next) => {
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
    .route('/steptwo')
    .patch(jsonParser, (req, res, next) => {
        console.log('getting to step2')
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

successRoute
    .route('/step')
    .all(jsonParser, (req, res, next) => {

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
    .get((req, res, next) => {
        //console.log('got to all')
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
    .delete(jsonParser, (req, res, next) => {
        console.log('At Delete')
        const { id } = req.body;
        const deleteId = { id }

        console.log('Delete id: ' + id)

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
    .post(jsonParser, (req, res, next) => {

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
    .patch(jsonParser, (req, res, next) => {

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