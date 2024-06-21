const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { connectDB, user, exercise, log } = require('./config/db') 

connectDB();


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Create new user
app.post('/api/users', async (req, res)=> {
  try {
    const newUser = new user({ username: req.body.username });
    const savedUser = await newUser.save();
    console.log(savedUser)
    res.json(savedUser);
  } catch (error) {
    console.log(error)
    res.json({"error" : "user not created!"});
  }
})

// Get all users
app.get('/api/users', async (req,res) => {
  const users = await user.find();
  res.json(users);
})

// New exercise entry
app.post('/api/users/:_id/exercises', async (req, res) => {
  const getID = req.params._id;
  const getUser = await user.findById(getID);

  let date = new Date().toDateString()

  if (req.body.date) {
    let formDate = new Date(req.body.date).toDateString();
    date = formDate;
  }

  const newExercise = await exercise.create({
    id: getUser._id,
    description: req.body.description,
    duration: req.body.duration,
    date: date,
  }) 

  const savedExercise = await newExercise.save();
  res.json({
    _id: getUser._id,
    username: getUser.username,
    description: savedExercise.description,
    duration: savedExercise.duration,
    date: savedExercise.date
  });
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const getUser = await user.findById(req.params._id);

  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;

  // When building queries, you start with a query object
  let query = { id: req.params._id}
  console.log(query)


  // query.date will refer to the date key in the DB
  // I STILL DON'T GET HOW THE QUERY INTERACTS WITH MONGO SYNTAX
  if (from) {
    query.date = { $gte: new Date(from) }
  }

  if (to) {
    query.date = { $lte : new Date(to) };
  }

  if (from && to ) {
    query.date = { $gte: new Date(from), $lte : new Date(to) }
  }

  console.log(query.date)
  
  const exercises = await exercise.find(query)

  const log = exercises.map((indExercise) => ({
      description: indExercise.description,
      duration: indExercise.duration,
      date: indExercise.date
  }));

  console.log(log)

  res.json({
    username: getUser.username,
    count: exercises.length,
    _id: getUser._id,
    log
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
