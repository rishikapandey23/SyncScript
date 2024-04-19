const mongoose = require('mongoose');

// Connect to MongoDB

const connectDB = () => {
    mongoose
    .connect("mongodb://127.0.0.1:27017/quillTextEditor")
    .then(() => {
      console.log("Database connection established");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB: " + err.message);
    });
}

module.exports = connectDB;
