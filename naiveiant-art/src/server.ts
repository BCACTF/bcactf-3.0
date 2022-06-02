import expressBuilder, { json as expressJSON } from "express";
import { readFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { escapeHtml } from "xss";
import antiSpamMiddleware from "./anti-spam";

import { colToNum, getImage, getNewName } from "./image-stuff";
import instanceMiddleware, { createInstance } from "./instance-manager";
import nominateArtwork from "./nomination";

const server = expressBuilder();

const admin_panel_creds = JSON.parse(readFileSync("private_data/secret_admin_panel_creds.json", { encoding: "utf-8" })).cookiePassword;

server.get("/", async (req, res) => {
    const [id, event] = createInstance(req);
    event.addEventListener("dir_made", () => res.redirect(`/${id}`));
});

server.get("/:instanceid/", instanceMiddleware, async (req, res) => {
    try {
        res.send((await readFile("public/index.html", { encoding: "utf-8" })).replaceAll("%%INSTANCEID%%", req.params.instanceid));
    } catch (e) {
        res.status(500).contentType("text/plain").send(String(e));
    }
});

server.get("/:instanceid/gallery", instanceMiddleware, async (req, res) => {
    try {
        const escaped = true;

        console.log(req.params.instanceid);

        const [gallery_html, data_json] = await Promise.all([
            readFile("public/gallery/index.html", { encoding: "utf-8" }),
            readFile(`data/${req.params.instanceid}/art_pieces.json`, { encoding: "utf-8" }).then(JSON.parse),
        ]);
        
        const list = await Promise.all(
            data_json.map(
                async (data: { title: string, image: string }, index: number) => `
                    <a href="/${req.params.instanceid}/gallery/${index}"><div>
                        <h1>${escaped ? escapeHtml(data.title) : data.title}</h1>
                        <br>
                        <img src="data:image/png;base64,${await readFile(data.image).then((buf) => buf.toString("base64"))}">
                    </div></a>
                `,
            ),
        );

        const outputHtml = gallery_html.replaceAll("%%INSTANCEID%%", req.params.instanceid).replaceAll("%%CONTENT_GOES_HERE%%", list.join("<br><br>"));
        
        res.send(outputHtml);
    } catch (e) {
        res.status(500).contentType("text/plain").send(String(e));
    }
});

server.get("/:instanceid/gallery/:pieceId", instanceMiddleware, async (req, res) => {
    try {
        // for debugging lol
        const escaped = req.query.escaped !== "DISABLED";

        const id = parseInt(req.params.pieceId);

        const [piece_html, data_json] = await Promise.all([
            readFile("public/gallery/piece/index.html", { encoding: "utf-8" }),
            readFile(`data/${req.params.instanceid}/art_pieces.json`, { encoding: "utf-8" }).then(JSON.parse),
        ]);

        const pieceData: { title: string, image: string } = data_json[id];
        
        const art_piece = `
            <div>
                <h1>${escaped ? escapeHtml(pieceData.title) : pieceData.title}</h1>
                <br>
                <img id="image" src="data:image/png;base64,${await readFile(pieceData.image).then((buf) => buf.toString("base64"))}">
            </div>
        `;

        const outputHtml = piece_html.replaceAll("%%INSTANCEID%%", req.params.instanceid).replaceAll("%%CONTENT_GOES_HERE%%", art_piece);
        
        res.send(outputHtml);
    } catch (e) {
        res.status(500).contentType("text/plain").send(String(e));
    }
    
});

server.get("/:instanceid/make", instanceMiddleware, async (req, res) => {
    try {
        res.send((await readFile("public/make/index.html", { encoding: "utf-8" })).replaceAll("%%INSTANCEID%%", req.params.instanceid));
    } catch (e) {
        res.status(500).contentType("text/plain").send(String(e));
    }
});

server.post("/:instanceid/submit_image", instanceMiddleware, antiSpamMiddleware, expressJSON(), async (req, res) => {
    try {
        const { size: { width, height }, bckgClr: { r, g, b }, pixels, name } = req.body;

        const inRange  = 10<width&&width<100 && 10<height&&height<100;
        const rgbTypes = typeof r === "number" && typeof g === "number" && typeof b === "number";

        if (inRange && rgbTypes && Array.isArray(pixels)) {
            const backgroundColor = colToNum([r, g, b, 255]);
            const widthArr = Array(width).fill(null);
            const imageData = Array(height).fill(null).map(() => widthArr.map(() => backgroundColor));

            for (const { color: { r, g, b }, x, y } of pixels) {
                const color = colToNum([r, g, b, 255]);
                if (x >= width || y >= height || x < 0 || y < 0) throw new Error("Something malicious probably happened, or skysky screwed up. idk. Either way, your pixel was out of bounds.");
                imageData[y][x] = color;
            }

            const origImage = await getImage(imageData, 10);

            const imgPath = `data/${req.params.instanceid}/${getNewName()}`;
            await origImage.writeAsync(imgPath);

            const piecesArr: { title: string, image: string }[] = JSON.parse(await readFile(`data/${req.params.instanceid}/art_pieces.json`, "utf-8"));

            piecesArr.push({ title: name, image: imgPath });
            await writeFile(`data/${req.params.instanceid}/art_pieces.json`, JSON.stringify(piecesArr));

            res.status(200).send("");
        } else {
            res.status(400).contentType("text/plain").send("stop trying to break it >>>>>>:(");
        }
    } catch (e) {
        res.status(400).contentType("text/plain").send(`stoppppppppppppp :( ${e}`);
    }
});

server.post("/:instanceid/nominate", instanceMiddleware, antiSpamMiddleware, expressJSON(), (req, res) => {
    let url: string;
    if (req.query.url && (url = req.query.url.toString()) && !url.includes("?")) {
        try {
            nominateArtwork(url, req.params.instanceid).then(() => res.status(200).send("YAYYYYYYY")).catch(() => res.status(500).send("uh oh"));
        } catch (e) {
            res.status(500).contentType("text/plain").send(
                `something went wrong i guess lol:\n${e}`
            );
        }
    } else {
        res.status(400).contentType("text/plain").send("ILLEGAL URL");
    }
});

server.get("/:instanceid/super_secret_admin_page", instanceMiddleware, async (req, res) => {
    const cookieAuth = req.cookies && req.cookies.password === admin_panel_creds;
    const urlprmAuth = req.query && req.query.password === admin_panel_creds;
    if (cookieAuth || urlprmAuth) {
        res.send((await readFile("private/super_secret_admin_page.html", { encoding: "utf-8" })).replaceAll("%%SECRET_COOKIE_PASSWORD%%", admin_panel_creds));
    } else {
        console.log(`cookieAuth: ${req.cookies}, urlprmAuth:`, req.query);
        res.sendStatus(403);
    }
});


server.listen(3000, () => console.log("listening on 3000"));

