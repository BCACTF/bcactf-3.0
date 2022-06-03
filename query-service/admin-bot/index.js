const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const config = require('./config.json');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get('/', function (req, res) {
    return res.render('index', { challName: config.challengeName });
});

app.post('/', (req, res) => {
    const link = req.body.link;
    let consoleOutput = [];
    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--incognito']});
        const page = await browser.newPage();
        if (config.redirectConsoleOutput) {
            page.on('console', async e => {
                const args = await Promise.all(e.args().map(a => a.jsonValue()));
                args.forEach(e => { consoleOutput.push("||" + e.replaceAll('\n', '')) });
            });
        }
        try {
            await page.goto(link);
        } catch (err) {
            return res.render('index', { msgColor: "red", status: "Error visiting URL", challName: config.challengeName });
        }
        await page.setCookie(...config.cookies);
        await page.cookies(link);
        await page.waitForTimeout(config.timeout);
        await browser.close();
        if (config.redirectConsoleOutput) {
            return res.render('index', { msgColor: "green", status: "Successfully visited URL! Check the console for more information.", info: consoleOutput, challName: config.challengeName });
        } else {
            return res.render('index', { msgColor: "#00ff00", status: "Successfully visited URL!", challName: config.challengeName });
        }
    })();
});

app.listen(3000, () => {
    console.log("Server started on port 3000, url: http://localhost:3000");
});