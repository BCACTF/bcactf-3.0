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
grayArr.resize((nHeight, nWidth))
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
    pass

def idct2(arr):
    pass

# for i in range

# use the quantization table on it
# Read the matrix from top left to bottom right order
# compress said file

# make a file containing the image and the quantization table

# give the problem solver a library to open the file type
# uncompress the file
# undo the quantization
# use inverse DCT
# convert back to an image