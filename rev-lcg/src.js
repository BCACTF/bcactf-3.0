const flag = process.env.FLAG; // example: bcactf{example flag}

function* bLCG(s, a, b) {
    while (true) {
        s = (a * s + b) % 65536
        yield s;
    }
}

const B1 = ~~(Math.random() * 65536)
const B2 = ~~(Math.random() * 65536)
// console.log(B1,B2);
const lcg = bLCG(B1, B2, 17483);

const buf = new TextEncoder().encode(flag);
const u16view = new Uint16Array(buf.buffer);

for (let i = 0; i < u16view.length; ++i) {
    u16view[i] ^= lcg.next().value;
}

let hex = ""

for (const byte of buf) hex += byte.toString(16).padStart(2, "0");

console.log(hex);