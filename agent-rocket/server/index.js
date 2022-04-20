const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  return res.render("index", { error: false });
});

app.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "password") {
    return res.render("index", { error: true });
  }

  if (req.headers["user-agent"] !== "BCACTF Rocket Control Panel") {
    return res.render("account", { agent: false });
  }

  return res.render("account", { agent: true });
});

app.listen(3000, () => {
  console.log("Server started on port 3000, url: http://localhost:3000");
});
