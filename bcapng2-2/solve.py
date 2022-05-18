from PIL import Image
bcapng2 = open("chall.bcapng2", "rb").read()
width = bcapng2[0]
height = bcapng2[1]
pixels = int.from_bytes(bcapng2[2:],"big")
def verify(pxs):
    img = Image.new(mode="RGB", size=(width,height))
    for i in range(img.height-1,-1,-1):
        for j in range(img.width-1,-1,-1):
            if pxs%3 == 0:
                img.putpixel((j,i),(255,255,255))
            elif pxs%3 == 1:
                if (j//3)%2==0: return False
                img.putpixel((j,i),(255,37,0))
            else:
                if (j//3)%2==1: return False
                img.putpixel((j,i), (0,0,0))
            pxs = pxs // 3
    img.save("out.png")
    return True

i=0
for pxs in range(pixels,pixels+256**57-256**54,256**54):
    print(i)
    i+=1
    if verify(pxs):
        print("FOUND! See out.png")
        break
# gets answer in 11-12 mins on my machine
# extrapolating, would take ~36 to try all possibilities