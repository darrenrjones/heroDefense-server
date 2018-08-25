'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');


const app = express();
app.use(express.json()); //parse req body

// app.use(function (req, res, next) { 
//   res.header('Access-Control-Allow-Origin', '*'); 
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization'); 
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE'); 
//   if (req.method === 'OPTIONS') { 
//     return res.send(204); 
//   } next(); 
// });

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
app.use('/api/auth', authRouter);
app.use('/api', userRouter);


passport.use(localStrategy);
passport.use(jwtStrategy);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
