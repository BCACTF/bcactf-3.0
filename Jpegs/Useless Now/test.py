import numpy as np

array = np.zeros((16, 16))

array[0, 0] = 1
array[0, 8] = 2
array[8, 0] = 3
array[8, 8] = 4

#for i in range(0, 16, 8):
#    for j in range(0, 16, 8):
#        print(array[i:i+8,j:j+8])

result = ''



for index in range(16):
    if index <= 0: sign = '0'
    else: sign = '1'
    if index == 0:
        a = 0
    result += ( f'{sign}{int(abs(index)):08b}')

#height = int(result[:64], 2)
#width = int(result[64:128], 2)
bitImg = result
parts = [bitImg[i:i+9] for i in range(0, len(bitImg), 9)]
#print(parts)
H = 64

for i in range(0, H, 8):
    for j in range(0, 32, 8):
        #block = np.zeros((8, 8))
        print((i*16+j*8)/64)