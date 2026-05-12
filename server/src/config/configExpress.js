const express = require('express');
const path = require('path');

const session = require('../middlewears/session');
const trimBody = require('../middlewears/trimBody');

function configExpress(app) {
    app.use(express.static(path.resolve('src/static')));
    app.use('/uploads', express.static('static/uploads'));
    app.use(express.json());
    app.use(session());
    //app.use(trimBody('password'));

    return app;
};

module.exports = configExpress;