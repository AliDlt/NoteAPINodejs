const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./configs/db");

const noteRoute = require("./routes/noteRoutes");
const folderRoute = require("./routes/folderRoutes");
const todoRoute = require("./routes/todoRoutes");
const tagRoute = require("./routes/tagRoutes");
const authRoute = require("./routes/authRoutes");

require("dotenv").config();

const port = process.env.PORT;

// Enable CORS for all routes
app.use(cors());

//* Database connection and Init
db.connectDB();
// db.initializeDatabase();

app.use(express.json());

//* BodyPaser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use(noteRoute);
app.use(folderRoute);
app.use(todoRoute);
app.use(tagRoute);
app.use(authRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
