const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const connectDB = require("./configs/db");

const noteRoute = require("./routes/noteRoute");
const folderRoute = require("./routes/folderRoute");
const todoRoute = require("./routes/todoRoutes");

require("dotenv").config();

const port = process.env.PORT;

//* Database connection
connectDB();

app.use(express.json());

//* BodyPaser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use(noteRoute);
app.use(folderRoute);
app.use(todoRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
