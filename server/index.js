const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routs = require('./src/routs');
// const cors = require ('./src/middlewears/cors');
const configExpress = require('./src/config/configExpress');
const port = process.env.PORT || 3030;
const connectionString = process.env.DB_URL;

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://ipoma.vercel.app'
    ],
    credentials: true
}));

configExpress(app);

// app.use(cors());
app.use(routs);

mongoose.connect(connectionString)
    .then(() => {
    console.log(`DB is connected`);

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
}).catch(err => {console.log(err)});