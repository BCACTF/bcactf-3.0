const express=require("express");
const decode=require('jwt-decode');
const { readFileSync }=require("fs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
var path = require('path');

const port = 1337;

let secret = readFileSync('secret.txt');
let data = {
	isSubscriber: true,
};
const defaultToken = jwt.sign(data, secret);
const defaultResponse = '{"message":0}';
const malformedResponse = '{"message":1}';
const specialResponse = '{"message":"bcactf{hm@c_256_yeeeeah_24u9402}"}';

var app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));
app.use(cookieParser());

app.get('/checktoken', (req, res) => {
	var retVal = defaultResponse;
	if (req.cookies.token) {
		try {
			if (jwt.verify((req.cookies.token), secret)) {
				let jwt = req.cookies.token;
				//valid token
				let decoded = decode(jwt)
				if (decoded.isSubscriber == true) {
					retVal = specialResponse;
				}
			}
		}
		catch {
			retVal = malformedResponse;
		}
	}

	res.setHeader('Content-Type', 'application/json');
	res.cookie('token', defaultToken);
	res.send(retVal);
});

app.listen(port, () => {
	console.log(`The server is running http://localhost:${port}`);
});