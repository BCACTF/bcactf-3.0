const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get('/', function (req, res) {
  return res.render('index');
});

app.post('/', (req, res) => {
  const answer = req.body.answer;
  var result = "";
  if (answer == 7.75) {
    return res.redirect('/7_75');
  }
  else if (answer == 7 || answer == 8) {
    result = "Please include decimal points for optimal safety.";
  }
  else {
    result = "Incorrect, please use the link above provided by our Certified™ safety officers for the correct answer";
  }
  return res.render('index', { error: result });
});

app.post('/11674', (req, res) => {
  const answer = req.body.answer;
  if (answer == 163) {
    return res.render('flag');
  }
  else {
    res.render('../views/11674');
  }
});

app.get('/7_75', function (req, res) {
  res.render('../views/7_75');
})

app.get('/11674', function (req, res) {
  res.render('../views/11674');
})

app.get('*', function (req, res) {
  res.send('You stepped out of line. File not found.');
})

app.listen(3000, () => {
  console.log("Server started on port 3000, url: http://localhost:3000");
});
