from PIL import Image
bcapng2 = open("chall.bcapng2", "rb").read()
width = bcapng2[0]
height = bcapng2[1]
pixels = int.from_bytes(bcapng2[2:],"big")
img = Image.new(mode="RGB", size=(width,height))
for i in range(img.height-1,-1,-1):
    for j in range(img.width-1,-1,-1):
        if pixels%3 == 0:
            img.putpixel((j,i),(255,255,255))
        elif pixels%3 == 1:
            img.putpixel((j,i),(255,37,0))
        else:
            img.putpixel((j,i), (0,0,0))
        pixels = pixels // 3
img.save("out.png")