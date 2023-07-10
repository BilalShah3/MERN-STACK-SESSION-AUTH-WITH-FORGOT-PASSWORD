require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) 

const loginRouter = require('./routes/loginRoutes')

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, 
}

const MAX_AGE = 1000 * 60 * 60 * 3 // 3hrs

// This is where your API is making its initial connection to the database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
mongoose.connection.on('connected', () => {
    console.log('connected to database');
  });

// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION_STRING,
    collection: 'mySessions',
})
app.use(
    session({
      secret: 'gfdfgfg452e24drt9',
      name: 'session-id', // cookies name to be put in "key" field in postman
      store: mongoDBstore,
      cookie: {
        maxAge: MAX_AGE, // this is when our cookies will expired and the session will not be valid anymore (user will be log out)
        sameSite: false,
        secure: false, // to turn on just in production
      },
      resave: true,
      saveUninitialized: false,
    })
  )


app.use(cors(corsOptions))

// ROUTERS
app.use('/api', loginRouter)

// START SERVER
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

module.exports = app
