const mongoose = require('mongoose');
const express = require('express');
const postRoute = require('./blogroute');
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 })
app.use(express.json())
app.use('/posts', postRoute)


mongoose.connect('mongodb://localhost:27017/Blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('You are now connected to Mongo!'))
    .catch(err => console.error('Something went wrong', err));

const PORT = process.env.PORT || 5000;
    app.listen(5000, ()=>{
        console.log(`Litsening to Port ${PORT}`);
    })