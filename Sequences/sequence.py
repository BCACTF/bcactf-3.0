sequence = [0, 1, 3, 6, 2]
numbers = [774, 5842, 4294, 9433, 5232, 1871, 3292, 4213, 2752, 5521, 4581, 3829, 2812, 2244, 3312, 7059, 2959, 8297, 7497, 1272, 2288, 160, 594, 158, 4833, 7140, 5352, 142, 3018, 9468, 5625, 4848, 2051, 3008, 4298, 6250, 144]
validPass = "ABCFEDFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123457890{}_"

def gensequence():
    for i in range(10000):
        # TODO write sequence generator for one of the most famous sequences and add it to sequence
        pass
    
gensequence()

for i in numbers:
    print(validPass[sequence[i]%len(validPass)], end="")