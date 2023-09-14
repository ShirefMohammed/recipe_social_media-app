const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authenticationRouter = require("./routes/authenticationRouter");
const usersRouter = require("./routes/usersRouter");
const recipesRouter = require("./routes/recipesRouter");
const _PORT = process.env.PORT;

const app = express();
mongoose.connect(process.env.MONGO_CONNECTION);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use("/authentication", authenticationRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);
app.get("/", async (req, res) => res.send("home page"));

app.listen(_PORT, () => console.log(`SERVER WORK GOOD ON PORT ${_PORT}`));
