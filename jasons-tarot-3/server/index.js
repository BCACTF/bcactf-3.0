const express = require("express");
const decode = require('jwt-decode');
const cookieParser = require("cookie-parser");
const { readFileSync }=require("fs");
const jwt = require("jsonwebtoken");
var path = require("path");

const port = 6502;
const PUBLIC_KEY=readFileSync("public.pem",'utf-8');
const PRIVATE_KEY=readFileSync("key.pem",'utf-8');
//const privkey_pw=readFileSync("password.txt");

let data = {
	isSubscriber: false,
};
const defaultToken = jwt.sign(data, PRIVATE_KEY, { algorithm: 'RS256' });
const defaultResponse = '{"message":0}';
const malformedResponse = '{"message":1}';
const specialResponse = '{"message":"bcactf{w3_d3f1n3tly_d1dnt_h4v3_t0_ch4ng3_th1s_101010101010}"}';

var app = express();
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));
app.use(cookieParser());

app.get('/checktoken', (req, res) => {
	var retVal = defaultResponse;
	if (req.cookies.token) {
		var token =req.cookies.token;
		try {
			if (jwt.verify((token), PUBLIC_KEY)) {
				//let jwt = req.cookies.token;
				//valid token
				let decoded = decode(token)
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
