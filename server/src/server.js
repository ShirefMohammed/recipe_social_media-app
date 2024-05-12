const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const authenticationRouter = require("./routes/authenticationRouter");
const usersRouter = require("./routes/usersRouter");
const recipesRouter = require("./routes/recipesRouter");
const _PORT = process.env.PORT;

const app = express();
mongoose.connect(process.env.MONGO_CONNECTION);
console.log(process.env.MONGO_CONNECTION)

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use("/authentication", authenticationRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);
app.get("/", async (req, res) => res.send("home page"));

// Ping the server every 14 minutes to refresh on render platform
setInterval(() => {
  fetch(process.env.SERVER_URL)
    .then((res) => {
      if (res.ok) {
        console.log("Server ping successful");
      } else {
        console.error("Server ping failed:", res.status);
      }
    })
    .catch((error) => {
      console.error("Error pinging server:", error);
    });
}, 840000);

app.listen(_PORT, () => console.log(`SERVER WORK GOOD ON PORT ${_PORT}`));