const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routs = require('./src/routs');
const cors = require ('./src/middlewears/cors');
const configExpress = require('./src/config/configExpress');

const port = process.env.PORT;
const connectionString = `mongodb://localhost:27017/ipoma-project`;

const app = express();

configExpress(app);

app.use(cors());
app.use(routs);

mongoose.connect(connectionString)
    .then(() => {
    console.log(`DB is connected`);
    app.listen(port, console.log(`Server is listening on http://localhost:${port}...`));
});

// Alternative approuch to protect in case of an error with DB connection... You can use also try/catch
// mongoose.on('connect', () => console.log('DB is connected'));
// mongoose.on('disconnect', () => console.log('DB is disconnected'));
// mongoose.on('error', (err) => console.log(err));