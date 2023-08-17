const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const _PORT = process.env.PORT;

const authenticationRouter = require("./routes/authenticationRouter");
const usersRouter = require("./routes/usersRouter");
const recipesRouter = require("./routes/recipesRouter");

const app = express();
mongoose.connect(process.env.MONGO_CONNECTION);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // Let server being accessed by another domains (client)
app.use(express.json()); // Deal with json files
app.use("/authentication", authenticationRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);

app.listen(_PORT, () => console.log(`SERVER WORK GOOD ON PORT ${_PORT}`));
