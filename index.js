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

app.post('/api/users', async (req, res)=> {
  try {
    const newUser = new user({username: req.body.username});
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.json({"error" : "user not created!"});
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
