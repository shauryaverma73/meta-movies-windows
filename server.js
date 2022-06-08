const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_CONNECTION_STRING).then(con => {
    console.log('Database Connection successfull.');
});

const port = process.env.SERVER_PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server Online: ' + process.env.SERVER_PORT);
});
