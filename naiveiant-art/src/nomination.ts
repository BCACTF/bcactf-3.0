import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import "./internal";

const admin_panel_creds = JSON.parse(readFileSync("private_data/secret_admin_panel_creds.json", { encoding: "utf-8" })).cookiePassword;

export default async function nominateArtwork(url: string, instanceid: string): Promise<void> {
    const browser = await puppeteer.launch({
        args: [ "--enable-popup-blocking", "--auto-open-devtools-for-tabs", "--no-sandbox", "--incognito" ],
    });

    const page = await browser.newPage();
    
    try {
        await page.setCookie({
            name: "cookie",
            value: encodeURIComponent(admin_panel_creds.cookiePassword),
            domain: "0.0.0.0:3000",
            path: "/",
        });

        await page.goto(`http://0.0.0.0:5000/${instanceid}/internal_transfer_html_url`);

        await new Promise(res => setTimeout(() => res(null), 3000));

        // page.deleteCookie({
        //     name: "cookie",
        //     domain: "0.0.0.0:3000",
        //     path: "/",
        // });

        await page.evaluate(`window.url = ${JSON.stringify(url)}`);

        // eslint-disable-next-line
        // @ts-ignore
        await page.$eval("#target", el => (el as HTMLIFrameElement).src = window.url);

        // await new Promise(res => setTimeout(() => res(null), 30000));

        
    } catch (e) {
        await page.close();
        await browser.close();
        throw e;
    }

    await page.close();
    await browser.close();
}

