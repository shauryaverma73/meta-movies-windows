const express = require('express');
const app = express();
const userRouter = require('./routes/userRoute');
const movieRouter = require('./routes/movieRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoute');
const cookieParser = require('cookie-parser');
const pug = require('pug');
const path = require('path');

// setting view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// public folder
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(express.json());
app.use(cookieParser());

// Router Mounting Points
app.use('/', viewRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/review', reviewRouter);
module.exports = app;