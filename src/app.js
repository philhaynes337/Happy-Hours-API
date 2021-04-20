require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bearerToken = require('./bearerToken');




const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))

app.use(cors());
app.use(helmet());
app.use(bearerToken);

app.get('/', (req, res) => {
    res.send('Backend Happy Hours Up and Running.....')
});

module.exports = app