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
    res.json(savedUser);
  } catch (error) {
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
  console.log("user is " + getUser)
  const savedExercise = await newExercise.save();
  res.json({username: getUser.username, savedExercise, id: getUser._id });
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
