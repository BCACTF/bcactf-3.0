const jimp = require('jimp');

async function main() {
    const image = await jimp.read('modifiedflag.png');
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    image.scan(0, 0, width, height, (x, y, idx)=>{
        image.bitmap.data[idx+3] = 255;
        image.bitmap.data[idx+2] += 129;
        image.bitmap.data[idx+1] += 68;

        if (x == image.bitmap.width - 1 && y == image.bitmap.height - 1) {
            image.write("outputflag.png");
        }
    });

}
main();