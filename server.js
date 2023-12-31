const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors');

const {apiRouter} = require('./routes/apiRoute');
dotenv.config({path: './config.env'});

const DATABASE = process.env.DATABASE;
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
    return res.status(200).json({
        status: 'Success',
        message: 'Wellcome Eval 6',
    });
});

app.use('/api', apiRouter);

app.listen(PORT, function () {
    console.log('Connecting...');
});

mongoose
    .connect(DATABASE)
    .then(function () {
        console.log(`URL : http://127.0.0.1:${PORT}`);
    })
    .catch(function (err) {
        console.log('DB Connection Error');
    });
