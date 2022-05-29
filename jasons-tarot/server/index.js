const express=require("express");
const decode=require('jwt-decode');
const { readFileSync, read }=require("fs");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
var path = require('path');
const url=require('url');

const port=1337;

//let secret=readFileSync('secret.txt');
let data={
	isSubscriber: false,
};
const defaultToken = jwt.sign(data, '',{algorithm: 'none'});
const defaultResponse = '{"message":0}';
const malformedResponse = '{"message":1}';
const specialResponse = '{"message":"bcactf{n0_s3cr3t5????!!!?!_38893}"}';
//const specialResponse=readFileSync('flag.txt');

var app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));
app.use(cookieParser());

app.get('/checktoken', (req, res) => {
        var retVal = defaultResponse;
        console.log("starting checktoken");
        if(req.cookies.token){
                console.log("found token: "+req.cookies.token);
                /*if (req.cookies.token == specialToken){
                        console.log("special token");
                        retVal=specialResponse;
                }
                else {
                        // failed special token, reset cookie
                        console.log("not special token");
                }*/
		try{
			if (jwt.verify((req.cookies.token),'',{algorithm: 'none'})){
				let jwt=req.cookies.token;
				//valid token
				let decoded=decode(jwt)
				console.log("decoded token:"+decoded);
				console.log("decoded token.isSubscriber="+decoded.isSubscriber);
				console.log("decoded token['isSubscriber']="+decoded['isSubscriber']);
				//let jwtObj=JSON.parse(decoded);
				if(decoded.isSubscriber==true){
					//res.send("flag get");
					retVal=specialResponse;
				}
				else{
					//res.send("tarot get!");
					console.log("not subsrcibe~!");
				}
			}
		}	
		catch{
			console.log("malformed jwt");
			retVal=malformedResponse;
		}
	}
        else {
                // no cookie present, set default
                console.log("No cookie token");
        }
	console.log("Resetting token to default and returning "+retVal);
	console.log("Think i'm resetting token to "+defaultToken);

        res.setHeader('Content-Type', 'application/json');
        res.cookie('token', defaultToken);
        res.send(retVal);
});

app.listen(port, () => {
        console.log("The server is running http://localhost:1337");
});