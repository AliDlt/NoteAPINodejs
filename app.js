const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./configs/db");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger");

const noteRoute = require("./routes/noteRoutes");
const folderRoute = require("./routes/folderRoutes");
const todoRoute = require("./routes/todoRoutes");
const tagRoute = require("./routes/tagRoutes");
const authRoute = require("./routes/authRoutes");
const uploadRoute = require("./routes/uploadRoutes");

if (process.env.NODE_ENV === "production") {
  require("dotenv").config();
}

const port = process.env.PORT;

// Enable CORS for all routes
app.use(cors());

//* Database connection
db.connectDB();

app.use(express.json());
app.use(express.static("public"));

//* BodyPaser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve Swagger documentation
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use(noteRoute);
app.use(folderRoute);
app.use(todoRoute);
app.use(tagRoute);
app.use(authRoute);
app.use(uploadRoute);

// Handle 404
app.get("*", function (req, res) {
  res.status(404).json("Not found");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
