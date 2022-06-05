import { Request, Response } from "express";

const spamTimeout = 10000;
const antiSpamIPTable: Map<bigint, number> = new Map();

const antiSpamMiddleware = (req: Request, res: Response, next: (e?: Error) => void): void => {
    try {
        const antiSpamIP = BigInt(`0x${req.params.instanceid}`);
        const newDatetime = new Date().getTime();
        if (newDatetime - (antiSpamIPTable.get(antiSpamIP) ?? 0) < spamTimeout) {
            res.status(429).send(`Wait at least ${spamTimeout / 1000} seconds between requests!`);
            next(new Error(`user of instance ${req.params.instanceid} waited less time than the spam timeout`));
        } else {
            antiSpamIPTable.set(antiSpamIP, newDatetime);
            next();
        }
    } catch (e) {
        if (e instanceof Error) {
            next(e);
        } else {
            next(new Error(String(e)));
        }
    }
};

export default antiSpamMiddleware;

export const intervalID = setInterval(() => {
    const now = new Date().getTime();
    for (const [key, entry] of antiSpamIPTable) {
        if (now - entry >= spamTimeout) antiSpamIPTable.delete(key);
    }
}, 60_000);