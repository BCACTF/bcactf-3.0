# below from https://stackoverflow.com/a/10238140
# (licensed CC BY-SA 3.0, by John Gaines Jr.)
def tobits(s):
    result = []
    for c in s:
        bits = bin(ord(c))[2:]
        bits = '00000000'[len(bits):] + bits
        result.extend([b for b in bits])
    return result
def frombits(bits):
    chars = []
    for b in range(int(len(bits) / 8)):
        byte = bits[b*8:(b+1)*8]
        chars.append(chr(int(''.join([str(bit) for bit in byte]), 2)))
    return ''.join(chars)
# end copied text

def unshuffle(deck,out):
    newdeck = [0 for q in range(len(deck))]
    for j in range(int(len(deck)/2)):
        if out == 0:
            newdeck[j]=deck[2*j]
            newdeck[j+int(len(deck)/2)]=deck[2*j+1]
        else:
            newdeck[j]=deck[2*j+1]
            newdeck[j+int(len(deck)/2)]=deck[2*j]
    return newdeck

f = open("shuffled", "rb").read()
txt = open("out.txt", "w")
deck = []
for b in f:
    deck.extend([c for c in format(b,"008b")])
order = [0, 1, 0, 0, 0, 1, 1, 0] # reversed
for i in order:
    deck = unshuffle(deck,i)
txt.write(frombits(deck))
