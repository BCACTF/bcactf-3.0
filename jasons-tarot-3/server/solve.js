const express = require("express");
const decode = require('jwt-decode');
const cookieParser = require("cookie-parser");
const { readFileSync }=require("fs");
const jwt = require("jsonwebtoken");
var path = require("path");

const PUBLIC_KEY=readFileSync("public.pem",'utf-8');
const PRIVATE_KEY=readFileSync("key.pem",'utf-8');

let data = {
	isSubscriber: true,
};

const defaultToken = jwt.sign(data, PUBLIC_KEY);
console.log(defaultToken);
