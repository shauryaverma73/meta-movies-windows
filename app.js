const express = require('express');
const app = express();
const userRouter = require('./routes/userRoute');
const movieRouter = require('./routes/movieRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoute');
const streamRouter = require('./routes/streamRoute');
const cookieParser = require('cookie-parser');
const subscriptionRouter = require('./routes/subscriptionRoute');

subscriptionRouter
const pug = require('pug');
const path = require('path');
const morgan = require('morgan');
const monitor = require('express-status-monitor');
const authController = require('./controller/authController');

// server status
// app.use(authController.protect,monitor());
app.use(require('express-status-monitor')());

// setting view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// public folder
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(morgan('dev'));

// Router Mounting Points
app.use(morgan('dev'));
app.use('/', viewRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/stream', streamRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/review', reviewRouter);

app.all('*', (req, res, next) => {
    res.status(200).render('404', {
        title: 'Error Page Not Found'
    });
});


module.exports = app;

