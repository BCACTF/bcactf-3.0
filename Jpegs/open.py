from PIL import Image
import numpy as np
import cv2
import gzip
np.set_printoptions(suppress=True)

with gzip.open('image.txt.gz', 'rb') as f:
    file_content = f.read()
temp = open("temp.txt", "wb")
temp.write(file_content)
temp.close()
with open("temp.txt", "r") as f:
    f = f.read()
    height = f[:64]
    width = f[64:128]
    bitImg = f[128:]

order = [0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]

reduArr = np.zeros((height, width))
for i in range(0, height, 8):
    for j in range(0, width, 8):
        block = np.zeros(64)
        pointer = height * width
        for index in range(pointer, pointer + 64):
            block[index % 64] = bitImg[pointer] # still needs to convert from binary to int
        reduArr[i:i+8,j:j+8] = block.reshape((8, 8))

# defines DCT
# dctArr = np.zeros((nHeight, nWidth))


def idct2(arr):
    return cv2.idct(arr/255)*255
    # return fftpack.idct(fftpack.idct(arr, type=3, axis=0, norm='ortho'), type=3, axis=1, norm='ortho')
'''
# thresholds table
scalar = np.array([16, 11, 10, 16, 24, 40, 51, 61,
                   12, 12, 14, 19, 26, 58, 60, 55,
                   14, 13, 16, 24, 40, 57, 69, 56,
                   14, 17, 22, 29, 51, 87, 80, 62,
                   18, 22, 37, 56, 68, 109,103,77,
                   24, 35, 55, 64, 81, 104,113,92,
                   49, 64, 78, 87, 103,121,120,101,
                   72, 92, 95, 98, 112,100,103,99])
scalar = scalar.reshape((8, 8))

# scales back threshold
unreduArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        unreduArr[i:i+8,j:j+8] = np.multiply(reduArr[i:i+8,j:j+8], scalar)

print("After Unquantization:")
print(unreduArr[160:168,160:168])

unreduArr = dctArr
# uses IDCT
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        unreduArr[i:i+8,j:j+8] = idct2(unreduArr[i:i+8,j:j+8])

# converts back to image

for i in range(0, nHeight):
    for j in range(0, nWidth):
        unreduArr[i,j] = unreduArr[i,j].round()

print("After IDCT:")
print(unreduArr[160:168,160:168])
#(Image.fromarray(unreduArr[160:168,160:168])).show()

endImage = Image.fromarray(unreduArr)
# endImage.show()
'''