const express = require('express');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const apiRoutes = require('./routes/api');


const app = express();

app.use(express.static(path.join(__dirname, "images")));


const corsConfig = {
  credentials: true,
  origin: true
};

app.use(cors(corsConfig));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet());
app.use(apiRoutes);


app.listen(5000);