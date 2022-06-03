const hex = 'f31824e8f96ea624ce93587f893d8c20da4fc92c8ed3fb898ca9ef0fe2898ddd848fdfc1';
const length = 36;
const buf = new Uint8Array(vb.match(/../g).map(e => parseInt(e, 16)));
const u16view = new Uint16Array(v8.buffer);

const flagStart = new Uint16Array(new TextEncoder().encode("bcactf").buffer);

const lcgOut = flagStart.map((b, i) => b ^ v9[i]);

lcgOut

const inc = 17483;
const mod = 65536;

function* bLCG(seed, mul, inc) {
    while (true) {
        seed = (mul * seed + inc) % 65536
        yield seed;
    }
}

const findP = (out, mod, inc, k) => {
    const c = [];
    const inv = (mod + (out - inc)) % mod;
    for (let mul = 0; mul <= out; ++mul) {
        const p = (mod * mul + inv) / k;
        if (p % 1 === 0) {
            c.push(p);
        }
    }
    return c;
}

const c = findP(lcgOut[1], mod, inc, lcgOut[0])
scan: for (const b2 of c) {
    const m = findP(lcgOut[0], mod, inc, b2);

    for (const p of m) {
        const l = bLCG(p, b2, inc);

        if (l.next().value !== lcgOut[0]) continue;
        if (l.next().value !== lcgOut[1]) continue;
        if (l.next().value !== lcgOut[2]) continue;
        
        v9.set(flagStart, 0);
        for (let i = 3; i < v9.length; ++i) {
            v9[i] ^= l.next().value;
        }
        console.log(new TextDecoder().decode(new Uint8Array(v9.buffer)));
        break scan;
    }
}