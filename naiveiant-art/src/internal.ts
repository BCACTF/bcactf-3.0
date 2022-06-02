import expressBuilder from "express";
import instanceMiddleware from "./instance-manager";
import { readFileSync } from "fs";
import { readFile } from "fs/promises";

const admin_panel_creds = JSON.parse(readFileSync("private_data/secret_admin_panel_creds.json", { encoding: "utf-8" })).cookiePassword;

const server = expressBuilder();

server.get("/:instanceid/internal_transfer_html_url", instanceMiddleware, async (req, res) => {
    try {
        const raw_file = await readFile("persistent_data/nominationpage.html", { encoding: "utf-8" });

        const replacedFile = raw_file
            .replace("%%ADMIN_PAGE_PATH%%", `"http://0.0.0.0:3000/${req.params.instanceid}/super_secret_admin_page?password=${encodeURIComponent(admin_panel_creds)}"`);

        res.status(200).send(replacedFile);
    } catch (e) {
        console.error("I hate js sometimes. " + e);
        res.sendStatus(500);
    }
});

server.listen(5000, () => console.log("listening on 5000"));