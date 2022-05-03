from PIL import Image
import numpy as np
import cv2
from scipy import fftpack

# convert image to a matrix
img = Image.open('test.png')
arr = np.asarray(img)

# convert to grayscale
grayArr = np.zeros((len(arr), len(arr[0])))
for vert in range(len(arr)):
    for hori in range(len(arr[0])):
        grayArr[vert][hori] = arr[vert][hori][0]

# crops the image
nHeight = len(grayArr) - len(grayArr) % 8
nWidth = len(grayArr[0]) - len(grayArr[0]) % 8
cropArr = np.zeros((nHeight, nWidth)) # resize dumb
for i in range(0, nHeight):
    for j in range(0, nWidth):
        cropArr[i,j] = grayArr[i,j] - 128
grayArr = cropArr
# print(grayArr)

# defines DCT
dctArr = np.zeros((nHeight, nWidth))

def dct2(arr):
    return fftpack.dct(fftpack.dct(arr, axis=0, norm='ortho'), axis=1, norm='ortho')

def idct2(arr):
    return fftpack.idct(fftpack.idct(arr, axis=0, norm='ortho'), axis=1, norm='ortho')

# uses DCT
dctArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        dctArr[i:i+8,j:j+8] = dct2(grayArr[i:i+8,j:j+8])

print(dctArr)

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
        block = np.array(grayArr[i:i+8,j:j+8])
        reduArr[i:i+8,j:j+8] = np.divide(block, scalar)

for i in range(0, nHeight):
    for j in range(0, nWidth):
        reduArr[i,j] = reduArr[i,j].round()

print(reduArr)

# scales back threshold
unreduArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        unreduArr[i:i+8,j:j+8] = np.multiply(reduArr[i:i+8,j:j+8], scalar)

# uses IDCT
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        unreduArr[i:i+8,j:j+8] = idct2(unreduArr[i:i+8,j:j+8])

# converts back to image
for i in range(0, nHeight):
    for j in range(0, nWidth):
        unreduArr[i,j] += 128

print(unreduArr)

endImage = Image.fromarray(unreduArr)
#print(endImage)
#endImage.show()