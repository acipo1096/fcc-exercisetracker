const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    _id: ObjectId
})

// const Exercise = new Schema({
//     username: String,
//     description: String,
//     duration: Number,
//     date: Date,
// })

// const Log = new Schema({
//     username: String,
//     count: Number,
//     _id: "5fb5853f734231456ccb3b05",
//     log: [{
//       description: "test",
//       duration: 60,
//       date: "Mon Jan 01 1990",
//     }]
// })

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {dbName: 'exercisetracker'});
        console.log("MongoDB connected!")

    } catch (error) {
        console.log("Error! MongoDB NOT connected.")
        process.exit(1);
    }
}


const user = mongoose.model("User", User, "exercisetracker");

module.exports = { connectDB , user }