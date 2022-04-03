const jimp = require('jimp');
const fs = require('fs');
let modded = "";

async function main() {
    const image = await jimp.read('flag.png');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    image.scan(0, 0, width, height, (x, y, idx)=>{
        var red = image.bitmap.data[idx];
        var green = image.bitmap.data[idx + 1];
        var blue = image.bitmap.data[idx + 2];
        
        if (red < 84 || blue < 75 || green > 180) {
            modded += image.bitmap.data[idx] +"\n" + image.bitmap.data[idx+1] + "\n" + image.bitmap.data[idx+2] +"\n";
            image.bitmap.data[idx] = 255;
            image.bitmap.data[idx+2] = 0;
            image.bitmap.data[idx+1] = 0;
        } else {
            image.bitmap.data[idx] = ((x+y*y) * red) % 255;
            image.bitmap.data[idx+1] = ((x*x+y) * green) % 255;
            image.bitmap.data[idx+2] = ((x+y) * blue) % 255;
            modded +="XXX\n"
        }

        if (x % 2 == 0 || y % 4==0) {
            image.bitmap.data[idx] = 255;
            image.bitmap.data[idx+1] = 0;
            image.bitmap.data[idx+2] = 0;
        }


        if (x == image.bitmap.width - 1 && y == image.bitmap.height - 1) {
            image.write("modifiedflag23.png");
            fs.writeFileSync('extra.txt', modded)
        }
    });

}
main();