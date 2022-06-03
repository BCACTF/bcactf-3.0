import initExpress, { json, Response, static as serveStatic } from "express";
import dataTypeMiddleware, { loginType } from "./datatypemiddleware";
import { createHash } from "crypto";
import { Database } from "sqlite3";
import { randomBytes } from "crypto";
import menu from "./menu";
import { readFileSync } from "fs";

const flag = readFileSync("./flag.txt", "utf8");

const db = new Database(":memory:");
db.exec("CREATE TABLE users (username TEXT, password TEXT);");
db.exec("CREATE TABLE auth_tokens (token TEXT, username TEXT);")
db.exec("CREATE TABLE failed_logins (username TEXT, password TEXT);");

const server = initExpress();

function reportError(res: Response, err: any) {
    const messages = [
        '*angry whooshing noises*',
        'The Bloodthirty Breeze is disappointed at your inability to not cause an error.',
    ];
    console.error(err);
    res.status(500);
    res.send(messages[Math.floor(Math.random() * messages.length)]);
}

server.post("/api/login", json(), dataTypeMiddleware(loginType), async (req, res) => {
    try {
        const body: loginType = req.body;
        const {username, password} = body;

        const hashedPassword = (() => {
            const hash = createHash('md5');
            hash.update(password);
            return hash.digest().toString('base64');
        })();

        // Try to log in as the user
        const users = await new Promise<unknown[]>((resolve, reject) => {
            db.all(`SELECT * FROM users WHERE username = ? AND password = '${hashedPassword}';`, [username], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (users.length > 0) {
            // Login succeeded, generate an auth token, set the cookie, and return a response
            const token = randomBytes(32).toString('base64');
            await new Promise<void>((resolve, reject) => {
                db.exec(`INSERT INTO auth_tokens VALUES ('${token}', '${username}');`, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.cookie('auth', token);
            res.send("Log in successful! You are now authorized to access the menu.");
        } else {
            // Login failed, add the failed login to the database for auditing purposes
            await new Promise<void>((resolve, reject) => {
                db.exec(`INSERT INTO failed_logins VALUES ('${username}', '${hashedPassword}');`, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.status(403);
            res.send("Incorrect username or password.");
        }
    } catch (e) {
        reportError(res, e);
    }
});

server.get("/api/menu", async (req, res) => {
    try {
        if (!req.cookies.auth) {
            res.status(401);
            res.send(
                'The Bloodthirsty Breeze is interested in devouring your user data. Therefore, The Bloodthirsty Breeze requires that all visitors log in to view the menu, to maximize data collection efficiency.');
            return;
        }

        const authToken = req.cookies.auth;
        const users = await new Promise<unknown[]>((resolve, reject) => {
            db.all(
                `SELECT * FROM auth_tokens WHERE token = ?;`, [authToken],
                (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (users.length > 0) {
            const result = [...menu];
            result[Math.floor(Math.random() * result.length)].description = flag;
            res.json(result);
        } else {
            res.status(401);
            res.send("Hacking The Bloodthirsty Breeze isn't a breeze, you know. Try harder.");
        }
    } catch (e) {
        reportError(res, e);
    }
});

server.use(serveStatic("./build"));

server.listen(3000);