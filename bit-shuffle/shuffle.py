# below from https://stackoverflow.com/a/10238140
# (licensed CC BY-SA 3.0, by John Gaines Jr.)
def tobits(s):
    result = []
    for c in s:
        bits = bin(ord(c))[2:]
        bits = '00000000'[len(bits):] + bits
        result.extend([int(b) for b in bits])
    return result

def frombits(bits):
    chars = []
    for b in range(int(len(bits) / 8)):
        byte = bits[b*8:(b+1)*8]
        chars.append(chr(int(''.join([str(bit) for bit in byte]), 2)))
    return ''.join(chars)
# end copied text

txt = open("flag.txt", "r").read()
f = open("shuffled.txt", "w")
order = tobits("b")
deck = tobits(txt)
for i in order:
    newdeck = []
    for j in range(int(len(deck)/2)):
        if i == 0:
            newdeck.append(deck[j])
            newdeck.append(deck[j+int(len(deck)/2)])
        else:
            newdeck.append(deck[j+int(len(deck)/2)])
            newdeck.append(deck[j])
    deck = newdeck
f.write(frombits(deck))