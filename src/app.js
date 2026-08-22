const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.js');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/v1', routes);

// error handler
app.use(errorHandler)
module.exports = app;