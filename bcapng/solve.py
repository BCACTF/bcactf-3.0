from PIL import Image
bcapng = open("chall.bcapng", "r").read()
imgParts = bcapng.split("_")
img = Image.new(mode="RGB", size=(int(imgParts[0][1:]), int(imgParts[1])))
encodedImg = imgParts[2][:-1]
for i in range(len(encodedImg)):
    coord = (int(i % int(imgParts[0][1:])), int(i/int(imgParts[0][1:])))
    if encodedImg[i] == '0':
        img.putpixel(coord, (0, 0, 0))
    else:
        img.putpixel(coord, (255, 255, 255))
img.show()
