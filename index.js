const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { connectDB, user, exercise } = require('./config/db') 

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
  const getUser = await user.findById(req.body[':_id']);
  console.log(getUser)
  let date = new Date().toDateString();
  if (req.body.date) {
    date = req.body.date;
  }

  const newExercise = await exercise.create({
    description: req.body.description,
    duration: req.body.duration,
    date: date,
  }) 
  console.log(newExercise)
  const savedExercise = await newExercise.save();
  res.json({
    user: getUser.username,
    description: savedExercise.description,
    duration: savedExercise.duration,
    date: savedExercise.date,
    _id: getUser._id
  });
})

// THIS is how the res.json for exercise should look:
// {"_id":"61204ee8f5860e05a3652f0e","username":"fcc_test_16295073006","date":"Mon Jun 03 2024","duration":200,"description":"Basketball"}

// Passes FCC post test
// New exercise entry
// app.post('/api/users/:_id/exercises', async (req, res) => {
//   const getUser = await user.findById(req.body[':_id']);
//   let date = new Date().toDateString();
//   if (req.body.date) {
//     date = req.body.date;
//   }
//   const newExercise = await exercise.create({
//     description: req.body.description,
//     duration: req.body.duration,
//     date: date,
//   }) 
//   console.log(newExercise)
//   console.log("user is " + getUser)
//   const savedExercise = await newExercise.save();
//   res.json({username: getUser.username, savedExercise, id: getUser._id });
// })



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
