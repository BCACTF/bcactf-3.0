from PIL import Image

img = Image.open("flag.png")
f = open("chall.bcapng2", "wb")
f.write(bytes([img.width,img.height]))
pixeldata = 0
for i in range(img.height):
    for j in range(img.width):
        pixeldata *= 3
        if (img.getpixel((j, i)) == (0, 0, 0, 255)):
            pixeldata += 2
        elif (img.getpixel((j,i)) == (255, 37, 0, 255)):
            pixeldata += 1
f.write(pixeldata.to_bytes((pixeldata.bit_length() + 7) // 8, byteorder='big'))
f.close()