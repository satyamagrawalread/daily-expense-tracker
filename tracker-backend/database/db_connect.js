const mongoose = require('mongoose');

require('dotenv').config();
const connectDB = async () => mongoose.connect(process.env.MONGODB_URI).then(
    () => {
        console.log('connected to database');
    }
)
.catch((error) => {
    console.log('Could not connect to database: ' + error)
})

module.exports = connectDB;