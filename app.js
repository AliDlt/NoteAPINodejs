const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = require("./configs/db");

const noteRoute = require("./routes/noteRoute");
const folderRoute = require("./routes/folderRoute");
const todoRoute = require("./routes/todoRoutes");
const tagRoute = require("./routes/tagRoute");

require("dotenv").config();

const port = process.env.PORT;

//* Database connection and Init
db.connectDB();
db.initializeDatabase();

app.use(express.json());

//* BodyPaser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use(noteRoute);
app.use(folderRoute);
app.use(todoRoute);
app.use(tagRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
