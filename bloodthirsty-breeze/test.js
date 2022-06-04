const { createHash } = require("crypto");

const hasher = createHash("md5");
hasher.update("password1234");

console.log(hasher.digest().toString("base64"));