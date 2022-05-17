from PIL import Image
img = Image.open("./flag.png")
f = open("chall.bcapng", "w")
f.write("|" + str(img.width) + "_" + str(img.height) + "_")
for i in range(img.height):
    for j in range(img.width):
        if (img.getpixel((j, i)) == (0, 0, 0)):
            f.write("0")
        else:
            f.write("1")
f.write("|")
f.close()