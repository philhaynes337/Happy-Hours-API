const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken')

const apiService = {
    apiLogout(knex, id) {
        console.log(id)
        return knex('loggedin')
        .where({usid: id})
        .delete()
    },
    updateHappyHoursUsed(knex, id, data) {

        return knex('users')
        .update({ happyhours_used: data})
        .where({id})
    },
    getHappyHoursData(knex, id) {

        return knex
        .select('happyhours', 'happyhours_used', 'life_time_happyhours', 'user_name')
        .from('users')
        .where({id})
    },
    addHappyHours(knex, id, sumOfHappyHours) {

        return knex('users')
        .update(sumOfHappyHours)
        .where(id)
            
    },
    deleteEntry(knex, id) {
        
        return knex('usersdata')
            .where(id)
            .delete();
    },
    addEntry(knex, data) {
       
        return knex
            .insert(data)
            .into('usersdata')
            .returning('*')
            .then(rows => rows[0])
    },
    getIdByToken(knex, token) {
        return knex
            .select('usid')
            .from('loggedin')
            .where({token: token})
    },
    loggedin(knex, data) {
        return knex
            .insert(data)
            .into('loggedin')
    },
    updateEntry(knex, updateID, updateData, updateUserID) {
      
        return knex('usersdata')
            .where(updateID)
            .andWhere(updateUserID)
            .update(updateData)
    },
    getUsers(knex) {
        return knex
            .select('*')
            .from('users')
    },
    checkUsers(knex, user_name, user_email) {
        return knex
            .select('*')
            .from('users')
            .where({user_name: user_name})
            .orWhere({user_email: user_email})
            .first()
            .then(data => !!data)
    },
    checkUsersEmail(knex, user_email) {
        return knex
            .select('*')
            .from('users')
            .where({user_email})
            .first()
            .then(data => !!data)
    },
    hashedPassword(user_password) {
        return bcrypt.hash(user_password, 12)
    },
    addNewUser(knex, createUser) {
        return knex
            .insert(createUser)
            .into('users')
    },
    authGetName(knex, user_name) {
        return knex
            .select('*')
            .from('users')
            .where({user_name: user_name})
            .first();
    },
    checkPasswords(password, hash) {
        return bcrypt.compare(password, hash);
    },
    createToken(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },
    getByUserId(knex, userid) {
        return knex
            .select('*')
            .from('usersdata')
            .where({usid: userid})
            .orderBy('weekstart', 'asc')
    },
    getTotalHoursForUser(knex, userid) {
        return knex
            .sum('totalhours')
            .select('totalhours')
            .from('usersdata')
            .sum('totalhours')
    }

};

module.exports = apiService