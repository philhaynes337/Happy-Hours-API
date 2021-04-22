require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bearerToken = require('./bearerToken');
//Routes
const createRoute = require('./routers/create');
const authRoute = require('./routers/auth');
const successRoute = require('./routers/success');




const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))

app.use(cors());
app.use(helmet());
app.use(bearerToken);

//Routers
app.use('/create', createRoute);
app.use('/authentication', authRoute);
app.use('/success', successRoute);


app.get('/', (req, res) => {
    res.send('Backend Happy Hours Up and Running.....')
});

module.exports = app