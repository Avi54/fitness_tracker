const express = require('express')
const bodyParser = require('body-parser')

// date-fns
var format = require('date-fns/format')

// env file config
require('dotenv').config()

// create express app
const app = express()

// templating engine
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: false
}))

// database
const mongoose = require('mongoose');

// 'mongodb://localhost:27017/love'
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})

// schema
const loveSchema = new mongoose.Schema({
    durationMin: Number, 
    distance: Number,
    caloriesBurned: Number,
    weekNum: Number,
    dateOfExercise: String,
})

const Love = mongoose.model('Love', loveSchema)

// routes
app.get('/', (req, res) => {
    res.render('home')
})

// post new entry
app.post('/love', (req, res) => {
    // saving user input
    const durationMin = req.body.durationMin
    const durationSec = req.body.durationSec;
    const distance = req.body.distance;
    const caloriesBurned = req.body.caloriesBurned;
    const weekNum = req.body.weekNum;
    // formatting date using date-fns
    const date = format(new Date(req.body.date), 'dd-mm-yyyy');

    // calculating total time in minutes
    const totalTimeMin = parseFloat(durationMin) + parseFloat(durationSec / 60)
    // rounding total time to 2 decimal places
    const totalTimeRounded = Math.round((totalTimeMin + Number.EPSILON) * 100) / 100

    const love = new Love({
        durationMin: totalTimeRounded, 
        distance: distance,
        caloriesBurned: caloriesBurned,
        weekNum: weekNum,
        dateOfExercise: date
    })

    love.save(function (err) {
        if (!err) {
            res.render("score");
        } else {
            console.log(err)
        }
    });
})

// app.get('/score', (req, res) => {
//     res.render('score')
// })

app.get('/entries', (req, res) => {

    durationSum = 0
    distanceSum = 0
    caloriesSum = 0     

    Love.find({}, (err, loves) => {
        res.render("entries", 
        {
            love: loves
        },
        durationSum,
        distanceSum,
        caloriesSum
        );
    }).sort({
        weekNum: 1
    });
})

PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})