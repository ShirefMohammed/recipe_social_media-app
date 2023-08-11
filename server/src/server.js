const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const recipesRouter = require("./routes/recipes");
const _PORT = process.env.PORT || 3500;

const app = express();
mongoose.connect(process.env.DBCONNECTION);

// Set the maximum payload size to 50 megabytes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // Let server being accessed by another domains (client)
app.use(express.json()); // Deal with json files
app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);


app.listen(_PORT, () => console.log(`SERVER WORK GOOD ON PORT ${_PORT}`));
