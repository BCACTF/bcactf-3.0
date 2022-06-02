import Jimp from "jimp";

export const colToNum = (channels: number[]): number => {
    return channels.reduce((old, next) => typeof next === "number" ? old * 256 + Math.max(Math.min(next, 255), 0) : 0, 0);
};

export const getImage = async (safePixels: number[][], scale: number): Promise<Jimp> => {
    const img = await Jimp.read(safePixels.length * scale, safePixels[0].length * scale);
    safePixels.forEach(
        (row, y) => row.forEach(
            (val, x) => Array(scale).fill(null).forEach(
                (_, deltaY) => Array(scale).fill(null).forEach(
                    (_, deltaX) => img.setPixelColor(val, x * scale + deltaX, y * scale + deltaY)
                )
            )
        )
    );
    return img;
};


const usedIds: Set<number> = new Set(); 
const id_length = Number.MAX_SAFE_INTEGER.toString().length;

/**
 * 
 * @returns an image path with a unique id
 */
export const getNewName = () => {
    let id: number;
    while (usedIds.has(id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)));
    return `image-${id.toString().padStart(id_length, "0")}.png`;
};