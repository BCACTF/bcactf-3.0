from PIL import Image

row1 = {
    "0": 4,
    "1": 3,
    "2": 12,
    "3": 12,
    "4": 10,
    "8": 13,
    "_": 0,
    "{": 4,
    "}": 12,
    "a": 0,
    "b": 9,
    "B": 12,
    "c": 0,
    "C": 4,
    "E": 13,
    "f": 1,
    "F": 13,
    "K": 10,
    "N": 10,
    "O": 3,
    "Q": 3,
    "R": 12,
    "S": 4,
    "t": 3,
    "T": 13,
    "U": 10,
    "W": 10,
    "X": 10
}
row2 = {
    "0": 10,
    "1": 12,
    "2": 1,
    "3": 1,
    "4": 10,
    "8": 10,
    "_": 0,
    "{": 3,
    "}": 3,
    "a": 12,
    "b": 12,
    "B": 10,
    "c": 4,
    "C": 9,
    "E": 9,
    "f": 3,
    "F": 9,
    "K": 10,
    "N": 13,
    "O": 10,
    "Q": 10,
    "R": 10,
    "S": 9,
    "t": 13,
    "T": 3,
    "U": 10,
    "W": 10,
    "X": 10
}
row3 = {
    "0": 10,
    "1": 3,
    "2": 3,
    "3": 3,
    "4": 13,
    "8": 13,
    "_": 0,
    "{": 9,
    "}": 1,
    "a": 4,
    "b": 10,
    "B": 12,
    "c": 9,
    "C": 9,
    "E": 13,
    "f": 13,
    "F": 13,
    "K": 12,
    "N": 13,
    "O": 10,
    "Q": 10,
    "R": 13,
    "S": 3,
    "t": 3,
    "T": 3,
    "U": 10,
    "W": 13,
    "X": 3
}
row4 = {
    "0": 10,
    "1": 3,
    "2": 9,
    "3": 1,
    "4": 1,
    "8": 10,
    "_": 0,
    "{": 3,
    "}": 3,
    "a": 10,
    "b": 10,
    "B": 10,
    "c": 9,
    "C": 9,
    "E": 9,
    "f": 3,
    "F": 9,
    "K": 10,
    "N": 13,
    "O": 10,
    "Q": 13,
    "R": 12,
    "S": 1,
    "t": 3,
    "T": 3,
    "U": 10,
    "W": 13,
    "X": 10
}
row5 = {
    "0": 12,
    "1": 3,
    "2": 13,
    "3": 12,
    "4": 1,
    "8": 13,
    "_": 13,
    "{": 4,
    "}": 12,
    "a": 13,
    "b": 12,
    "B": 12,
    "c": 4,
    "C": 4,
    "E": 13,
    "f": 3,
    "F": 9,
    "K": 10,
    "N": 10,
    "O": 3,
    "Q": 4,
    "R": 10,
    "S": 12,
    "t": 4,
    "T": 3,
    "U": 4,
    "W": 10,
    "X": 10
}
# supported chars: 012348_{}abBcCEfFKNOQRStTUWX
txt = open("flag.txt", 'r').read()
f = open("chall.bcapng2", "wb")
r1, r2, r3, r4, r5 = 0,0,0,0,0
f.write(bytes([3*len(txt),5]))
for i in range(len(txt)):
    r1 *= 27
    r2 *= 27
    r3 *= 27
    r4 *= 27
    r5 *= 27
    r1 += (2-(i%2))*row1[txt[i]]
    r2 += (2-(i%2))*row2[txt[i]]
    r3 += (2-(i%2))*row3[txt[i]]
    r4 += (2-(i%2))*row4[txt[i]]
    r5 += (2-(i%2))*row5[txt[i]]
pixeldata = r5 + 27**len(txt) * (r4 + 27**len(txt) * (r3 + 27**len(txt) * (r2 + 27**len(txt) * r1)))
f.write(pixeldata.to_bytes((pixeldata.bit_length() + 7) // 8, byteorder='big'))
f.close()
# manually zero out bytes 35-37 (hex) in a hex editor