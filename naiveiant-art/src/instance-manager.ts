import { createHash } from "crypto";
import { Request, Response } from "express";
import { rmSync, mkdirSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import { inspect as utilInspect, InspectOptionsStylized } from "util";

/**
 * 20 minutes in milliseconds */ 
const instanceActivityTimeout = 1000 * 60 * 10;

/**
 * 
 * @param input Takes a string 
 * @returns 
 */
const scrambleSHA = (input: string): string => {
    const step1Hasher = createHash("sha256");
    step1Hasher.update(input);

    const step2Hasher = createHash("sha256");
    step2Hasher.update(step1Hasher.digest().sort());

    return step2Hasher.digest().reduce((prev, newByte) => prev + newByte.toString(16), "");
};

class Ref {
    constructor(private num: number, private refType?: string) {}

    [utilInspect.custom](_: unknown, options: InspectOptionsStylized) {
        return options.stylize(`[${this.refType ? this.refType + " " : "" }ref *${this.num}]`, "undefined");
    }
}

class BiDiMap<F, R> {
    forwardMap: Map<F, Set<R>>;
    reverseMap: Map<R, Set<F>>;

    constructor() {
        this.forwardMap = new Map();
        this.reverseMap = new Map();
    }

    public add(key: F, value: R) {
        const forwardSet = this.forwardMap.get(key) ?? new Set();
        forwardSet.add(value);
        this.forwardMap.set(key, forwardSet);

        const reverseSet = this.reverseMap.get(value) ?? new Set();
        reverseSet.add(key);
        this.reverseMap.set(value, reverseSet);
    }
    public rem(key: F): Set<R> {
        const forwardSet = this.forwardMap.get(key) ?? new Set();
        const outSet = forwardSet;

        this.forwardMap.delete(key);

        for (const revKey of outSet) {
            const reverseSet = this.reverseMap.get(revKey) ?? new Set();
            reverseSet.delete(key);
            if (reverseSet.size) this.reverseMap.delete(revKey);
        }

        return outSet;
    }

    public revAdd(revKey: R, revValue: F) {
        const reverseSet = this.reverseMap.get(revKey) ?? new Set();
        reverseSet.add(revValue);
        this.reverseMap.set(revKey, reverseSet);

        const forwardSet = this.forwardMap.get(revValue) ?? new Set();
        forwardSet.add(revKey);
        this.forwardMap.set(revValue, forwardSet);
    }
    public revRem(revKey: R): Set<F> {
        const reverseSet = this.reverseMap.get(revKey) ?? new Set();
        const outSet = new Set(reverseSet);

        this.reverseMap.delete(revKey);

        for (const forKey of outSet) {
            const forwardSet = this.forwardMap.get(forKey) ?? new Set();
            forwardSet.delete(revKey);
            if (forwardSet.size) this.forwardMap.delete(forKey);
        }

        return outSet;
    }

    public get(key: F): Set<R> | undefined {
        return this.forwardMap.get(key);
    }
    
    public revGet(revKey: R): Set<F> | undefined {
        return this.reverseMap.get(revKey);
    }
    
    [utilInspect.custom](depth: number | null, options: InspectOptionsStylized): string {
        if (typeof depth === "number" && depth < 0) {
            return `${options.stylize("[BiDiMap]", "special")}`;
        }

        const newOptions = Object.assign({}, options, {
            depth: typeof options.depth === "number" ? options.depth - 1 : null,
        });



        const padding = " ".repeat(4);

        const forwardKeyRefs = new Map([...this.forwardMap.keys()].map((item, index) => [item, new Ref(index, "forward")]));
        const reverseKeyRefs = new Map([...this.reverseMap.keys()].map((item, index) => [item, new Ref(index, "reverse")]));

        const forwardKeys = [
            ...this.forwardMap.entries(),
        ].map(
            ([key, forVals], index) => {
                const keyStr = utilInspect(key, newOptions).replace("\n", `\n${padding}`) + " " + utilInspect(new Ref(index, "forward"));
                const refs = utilInspect(new Set([...forVals].map(entry => reverseKeyRefs.get(entry))), newOptions);
                return `${keyStr} => ${refs}`;
            },
        );
        const reverseKeys = [
            ...this.reverseMap.entries(),
        ].map(
            ([key, forVals], index) => {
                const keyStr = utilInspect(key, newOptions).replace("\n", `\n${padding}`) + " " + utilInspect(new Ref(index, "reverse"));
                const refs = utilInspect(new Set([...forVals].map(entry => forwardKeyRefs.get(entry))), newOptions);
                return `${keyStr} => ${refs}`;
            },
        );



        // new Set( (mySet2.has(x)))
        
        // inspect()

        const forwardPart = `${padding}forward: {\n${forwardKeys.map(str => `${padding}${padding}${str.replace("\n", `\n${padding}${padding}`)}`).join(",\n")}\n${padding}}`;
        const reversePart = `${padding}reverse: {\n${reverseKeys.map(str => `${padding}${padding}${str.replace("\n", `\n${padding}${padding}`)}`).join(`,\n${padding}${padding}`)}\n${padding}}`;

        return `${options.stylize("BiDiMap", "special")} {\n${forwardPart}\n${reversePart}\n}`;
    }
}
const usedIDs: Set<bigint> = new Set();

const scrambledInstanceIPs: BiDiMap<bigint, string> = new BiDiMap();
const instanceTimeouts: Map<bigint, NodeJS.Timeout> = new Map();

const stopInstanceBuilder = (id: bigint) => () => {
    try {

        scrambledInstanceIPs.rem(id);
        instanceTimeouts.delete(id);

        rm(`data/${id.toString(16).padStart(idPadLen, "0")}`, { recursive: true, force: true });

        console.log(`instance ${id} removed`);
    } catch (e) {
        console.log("e");
        console.log(e);
    }
};

const getNewID = (): bigint => {
    let id: bigint;
    do {
        id = BigInt(Math.round(Math.random() * Number.MAX_SAFE_INTEGER));
    } while (usedIDs.has(id));
    return id;
};

const idPadLen = Number.MAX_SAFE_INTEGER.toString(16).length;
export const createInstance = (req: Request): [string, EventTarget] => {
    const id = getNewID();
    
    usedIDs.add(id);
    scrambledInstanceIPs.add(id, scrambleSHA(req.ip));
    instanceTimeouts.set(id, setTimeout(stopInstanceBuilder(id), instanceActivityTimeout));

    const dirCreationTarget = new EventTarget();

    mkdir(`data/${id.toString(16).padStart(idPadLen, "0")}`)
        .then(() => writeFile(`data/${id.toString(16).padStart(idPadLen, "0")}/art_pieces.json`, "[]"))
        .then(() => new Promise(resolve => setTimeout(resolve, 100)))
        .then(() => dirCreationTarget.dispatchEvent(new Event("dir_made")))
        .catch(e => console.log("Failed to create directory:" + e));

    return [id.toString(16).padStart(idPadLen, "0"), dirCreationTarget];
};

const instanceMiddleware = (req: Request, res: Response, next: (e?: Error) => void) => {
    try {
        
        const targetInstance = (() => {
            try {
                return BigInt(`0x${req.params.instanceid}`);
            } catch (e) {
                res.status(400).send("Invalid instance format!");
                throw new Error("Invalid instance format!");
            }
        })();

        const connectionIdenifier = scrambleSHA(req.ip);
        
        const instanceSet = scrambledInstanceIPs.get(targetInstance);

        if (instanceSet) {
            instanceSet.add(connectionIdenifier);
            const connectionsForConnectionIdentifier = scrambledInstanceIPs.revGet(connectionIdenifier);
            if (connectionsForConnectionIdentifier && (connectionsForConnectionIdentifier.size > 1) ) {
                connectionsForConnectionIdentifier.forEach(instance => {
                    if (instance != targetInstance) scrambledInstanceIPs.rem(instance);
                });
            }
            const newInstance = instanceTimeouts.get(targetInstance)?.refresh();
            if (newInstance) instanceTimeouts.set(targetInstance, newInstance);
            next();
        } else {
            next(new Error("Instance does not exist!"));
        }
    } catch (e) {
        if (e instanceof Error) {
            next(e);
        } else {
            next(new Error(String(e)));
        }
    }
};

rmSync("data", { recursive: true, force: true });
mkdirSync("data");

export default instanceMiddleware;