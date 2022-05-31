const express = require("express");
const decode = require('jwt-decode');
const { readFileSync, read } = require("fs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
var path = require("path");
const url = require("url");

const port = 1337;

let data = {
	isSubscriber: false,
};
const defaultToken = jwt.sign(data, '', { algorithm: 'none' });
const defaultResponse = '{"message":0}';
const malformedResponse = '{"message":1}';
const specialResponse = '{"message":"bcactf{n0_s3cr3t5????!!!?!_38893}"}';

var app = express();
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));
app.use(cookieParser());

app.get('/checktoken', (req, res) => {
	var retVal = defaultResponse;
	if (req.cookies.token) {
		try {
			if (jwt.verify((req.cookies.token), '', { algorithm: 'none' })) {
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
	res.cookie("token", defaultToken);
	res.send(retVal);
});

app.listen(port, () => {
	console.log(`The server is running http://localhost:${port}`);
});