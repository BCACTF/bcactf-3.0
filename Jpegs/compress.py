from PIL import Image
import numpy as np
import cv2
import gzip
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

# uses DCT
dctArr = np.zeros((nHeight, nWidth))
for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        dctArr[i:i+8,j:j+8] = dct2(grayArr[i:i+8,j:j+8])

# print("After DCT:")
# print(dctArr[160:168,160:168])

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

# print("After Quantization:")
# print(reduArr[160:168,160:168])
# print(reduArr)
# scales back threshold

# zigzag encoding

order = [0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]

result = ''

for i in range(0, nHeight, 8):
    for j in range(0, nWidth, 8):
        toBeRead = reduArr.flatten()
        for index in order:
            result += f'{int(abs(toBeRead[index])):08b}'

# print(result[:512])

# run-length encoding
'''
compressed = ''
currChr = result[0]
count = 0

for bit in result:
    if currChr == bit:
        count += 1
    else:
        compressed += f'{bit}{count}|'
        count = 1
        currChr = bit

# print(compressed)
'''
text_file = open("temp.txt", "w")
text_file.write(f'{nHeight:064b}{nWidth:064b}{result}')
text_file.close()

f_in = open("temp.txt", "rb")
f_out = gzip.open('image.txt.gz', 'wb')
f_out.writelines(f_in)
f_out.close()
f_in.close()