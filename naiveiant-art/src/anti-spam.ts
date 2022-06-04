import { Request } from "express";

const spamTimeout = 10000;
const antiSpamIPTable: Map<bigint, number> = new Map();

const antiSpamMiddleware = (req: Request, _: unknown, next: (e?: Error) => void): void => {
    try {
        const antiSpamIP = BigInt(`0x${req.params.instanceid}`);
        const newDatetime = new Date().getTime();
        if (newDatetime - (antiSpamIPTable.get(antiSpamIP) ?? 0) < spamTimeout) next(new Error(`Please wait ${spamTimeout / 1000} seconds between requests!`));
        else {
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