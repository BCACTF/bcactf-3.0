import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import "./internal";

const admin_panel_creds = JSON.parse(readFileSync("private_data/secret_admin_panel_creds.json", { encoding: "utf-8" })).cookiePassword;

export default async function nominateArtwork(url: string, instanceid: string): Promise<void> {
    const browser = await puppeteer.launch({
        args: [ "--enable-popup-blocking", "--auto-open-devtools-for-tabs", "--no-sandbox", "--incognito" ],
        headless: true,
    });

    const page = await browser.newPage();
    
    page
        .on("pageerror",     (err)       => console.log(err      ))
        .on("console",       (log)       => console.log(log      ))
        .on("response",      (resp)      => console.log(resp     ))
        .on("requestfailed", (failedReq) => console.log(failedReq));

    try {
        await page.goto(`http://0.0.0.0:5000/${instanceid}/internal_transfer_html_url`);

        await new Promise(res => setTimeout(() => res(null), 3000));

        await page.evaluate(`window.url = ${JSON.stringify(url)}`);

        // eslint-disable-next-line
        // @ts-ignore
        await page.$eval("#target", el => (el as HTMLIFrameElement).src = window.url);

        // await new Promise(res => setTimeout(() => res(null), 30000));

        await new Promise(res => setTimeout(() => res(null), 3000));
        
    } finally {
        await page   .close().catch(e => console.error(e));
        await browser.close().catch(e => console.error(e));
    }
}

