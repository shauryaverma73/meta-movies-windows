const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_CONNECTION_STRING).then(con => {
    console.log('Database Connection successfull.');
});

const server = app.listen(3000, () => {
    console.log('Server Online: ' + process.env.SERVER_PORT);
});
