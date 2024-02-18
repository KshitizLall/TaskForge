const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { logRequestResponse } = require("./middlewares/createLogs");
const userRouter = require("./routes/user");
const { connectMongoDb } = require("./config/connection");

const app = express();
app.use(cors());

// app.use(bodyParser.json());

// Connect MongoDb
connectMongoDb();

// middlewares
app.use(express.urlencoded({ extended: false }));
// app.use(logRequestResponse);

// Routes
app.use("/api/users", userRouter);

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
