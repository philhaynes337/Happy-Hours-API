const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken')

const apiService = {
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
    }

};

module.exports = apiService