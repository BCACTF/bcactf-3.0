from PIL import Image
import numpy as np
import cv2
np.set_printoptions(suppress=True)

# convert image to a matrix
img = Image.open('test.png')
# img.show()
arr = np.asarray(img, dtype=np.float64)

# convert to grayscale
grayArr = np.zeros((len(arr), len(arr[0])))
for vert in range(len(arr)):
    for hori in range(len(arr[0])):
        grayArr[vert][hori] = arr[vert][hori][0]

# print("After Conversion:")
# print(grayArr[160:168,160:168])

# crops the image
nHeight = len(grayArr) - len(grayArr) % 8
nWidth = len(grayArr[0]) - len(grayArr[0]) % 8
cropArr = np.zeros((nHeight, nWidth)) # resize dumb
for i in range(0, nHeight):
    for j in range(0, nWidth):
        cropArr[i,j] = grayArr[i,j]# - 128
grayArr = cropArr
# print(grayArr)

# defines DCT
dctArr = np.zeros((nHeight, nWidth))

def dct2(arr):
    return cv2.dct(arr/255)*255
    # return fftpack.dct(fftpack.dct(arr, type=2, axis=0, norm='ortho'), type=2, axis=1, norm='ortho')

def idct2(arr):
    return cv2.idct(arr/255)*255
    # return fftpack.idct(fftpack.idct(arr, type=3, axis=0, norm='ortho'), type=3, axis=1, norm='ortho')

# uses DCT
dctArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        dctArr[i:i+8,j:j+8] = dct2(grayArr[i:i+8,j:j+8])

print("After DCT:")
print(dctArr[160:168,160:168])

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

reduArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        block = np.array(dctArr[i:i+8,j:j+8])
        reduArr[i:i+8,j:j+8] = np.divide(block, scalar)

for i in range(0, nHeight):
    for j in range(0, nWidth):
        reduArr[i,j] = reduArr[i,j].round()

print("After Quantization:")
#print(reduArr[160:168,160:168])

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