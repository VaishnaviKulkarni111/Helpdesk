const express = require("express");
require('dotenv').config();

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const mailRoutes = require("./routes/mailRoutes");

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


const mongoUrl = "mongodb+srv://vaishnavirk2203:mbZiezno1OlnZg9h@diet-planner.4pdqs.mongodb.net/?retryWrites=true&w=majority&appName=Diet-Planner"
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
     useUnifiedTopology: true, 
  })
  .then(() => {
    mongoose.set('bufferCommands', false); // Disable buffering
    mongoose.set('bufferTimeoutMS', 20000);
    console.log("Connected to database");

  })
  .catch((e) => console.log(e));

// Include user routes
app.use(userRoutes);
app.use(ticketRoutes);
app.use(commentRoutes);
app.use(mailRoutes);

app.listen(5000, () => {
  console.log("Server Started");
});