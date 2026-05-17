const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('1');

const routs = require('./src/routs');

console.log('2');

const cors = require ('./src/middlewears/cors');

console.log('3');

const configExpress = require('./src/config/configExpress');

console.log('4');

const port = process.env.PORT || 3030;
const connectionString = process.env.DB_URL;

console.log(process.env.DB_URL);

const app = express();

configExpress(app);

app.use(cors());
app.use(routs);

mongoose.connect(connectionString)
    .then(() => {
    console.log(`DB is connected`);

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
    .catch(err => console.log(err));
})