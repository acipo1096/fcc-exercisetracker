const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
})

const Exercise = new Schema({
    id: {type: String, required: true},
    description: String,
    duration: Number,
    date: Date,
})

const Log = new Schema({
    id: {type: String, required: true},
    count: Number,
    log: {type: Array, }
})

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {dbName: 'exercisetracker'});
        console.log("MongoDB connected!")

    } catch (error) {
        console.log("Error! MongoDB NOT connected.")
        process.exit(1);
    }
}


const user = mongoose.model("User", User, "user");
const exercise = mongoose.model("Exercise", Exercise, "exercise");
const log = mongoose.model("Log", Log, "exercise")


module.exports = { connectDB , user, exercise, log }