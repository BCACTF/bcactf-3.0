from PIL import Image
import numpy as np
import cv2
from scipy import fftpack

# convert image to a matrix
img = Image.open('test.png')
arr = np.asarray(img)

print(arr)
print(len(arr)) # vertical
print(len(arr[0]))
print(img.size)
grayArr = np.zeros((len(arr), len(arr[0])))
for vert in range(len(arr)):
    for hori in range(len(arr[0])):
        grayArr[vert][hori] = arr[vert][hori][0]
nHeight = len(grayArr) - len(grayArr) % 8
nWidth = len(grayArr[0]) - len(grayArr[0]) % 8
grayArr.resize((nHeight, nWidth), refcheck=False)
print(grayArr)

# 1d array test
'''
test = np.array([1, 2, 3, 4, 5, 6, 7, 8])
print("original array:", test)
testdct = fftpack.dct(test, axis=0, norm="ortho")
print("after dct:", testdct)
for i in range(len(testdct)):
    testdct[i] = testdct[i].round()
print("after rounding:", testdct)
testidct = fftpack.idct(testdct, axis=0, norm="ortho")
for i in range(len(testidct)):
    testidct[i] = testidct[i].round()
print("after inverse and rounding:", testidct)
'''

# perform DCT on it
def dct2(arr):
    return fftpack.dct(fftpack.dct(arr, axis=0, norm='ortho'), axis=1, norm='ortho')

def idct2(arr):
    pass

dctArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        dctArr[i:i+8,j:j+8] = dct2(grayArr[i:i+8,j:j+8])

# use the quantization table on it
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


# Read the matrix from top left to bottom right order
# compress said file

# make a file containing the image and the quantization table

# give the problem solver a library to open the file type
# uncompress the file
# undo the quantization
# use inverse DCT
# convert back to an image