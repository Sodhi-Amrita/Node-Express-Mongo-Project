
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const exphbs = require('express-handlebars')
var path = require('path');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const port = process.env.PORT || 8000

const app = express()

app.use(express.static(path.join(__dirname, 'public')));


// Import function exported by newly installed node modules.


// setup handlebars
app.engine(
    '.hbs',
    exphbs.engine(
        {
            extname: '.hbs',
            handlebars: allowInsecurePrototypeAccess(Handlebars),
        helpers:
        {

        } 
        }
    )
)

app.set(
    'view engine',
    '.hbs'
)

/**
 * @api {get} / Rendring index.hbs
 */




// middleware for bodyparser
app.use(bodyParser.urlencoded({extended: false}))

// get settings
const settings = require('./config/settings')

// mongo db url
const db = settings.mongoDBUrl

// attempt to connect with DB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.log(err))

// Get profile routes
const profile = require('./routes/api/profile')
const auth = require('./routes/api/auth')

app.get('/', (req, res) => {
    res.send('Project is Running')
})

// actual routes
app.use('/api/profile', profile)

app.use('/api/auth', auth)

// Config for JWT strategy
require('./strategies/jsonwtStrategy')(passport)
/**
 * @api {get} Handles all not found URLs.
 */
app.get('*', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});




app.listen(port, () => console.log(`App running at port : ${port}`))

