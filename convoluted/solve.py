import numpy as np
from PIL import Image

def deconv(arr):
    temp = np.zeros((21,22),dtype=int)
    out = np.zeros((20,21),dtype=int) # this is stupid but i'm too lazy to figure out the right way
    for i in range(len(arr)):
        row = arr[i]
        for j in range(len(row)):
            temp[i+1][j+1] = arr[i][j]*4 - temp[i][j] - temp[i][j+1] - temp[i+1][j]
            out[i][j] = temp[i+1][j+1]
    return out

i = Image.open("chall.png")
a = np.array(i)
a = np.transpose(a,(2,0,1))
r = a[0]
g = a[1]
b = a[2]
r2 = deconv(r)
g2 = deconv(g)
b2 = deconv(b)
out = Image.fromarray(np.uint8(np.transpose(np.array([r2,g2,b2]),(1,2,0))))
out.save("out.png")