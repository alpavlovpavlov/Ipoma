const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routs = require('./src/routs');
const cors = require ('./src/middlewears/cors');
const configExpress = require('./src/config/configExpress');

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