import initExpress, { json } from "express";
import dataTypeMiddleware, { loginType } from "./datatypemiddleware";
import { createHash } from "crypto";
import { Database } from "sqlite3";

const db = new Database(":memory:");

const server = initExpress();

server.post("/login", json(), dataTypeMiddleware(loginType), (req, res) => {
    const body: loginType = req.body;
    const { username, password } = body;

    const hashedPassword = (() => {
        const hash = createHash("md5");
        hash.update(password); 
        return hash.digest().toString("base64");
    })();
    
    // const query = `SELECT * FROM USERS LIMIT 1 WHERE password_hash = ${hashedPassword} AND (username = ${username})`;
});