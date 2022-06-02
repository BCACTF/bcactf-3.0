def chunks(l, n):
    assert(len(l) % n == 0)
    for i in range(0, len(l), n):
        yield l[i:i+n]
M_SIZE = 24
flag = 'bcactf{the-gray-scott-system-is-a-reaction-diffusion-system-8RCEGOUALMP}'
assert(len(flag) == FLAG_LEN)
flag
def encrypt(ptxt):
    assert len(ptxt) == M_SIZE
    enc = [0] * M_SIZE
    for i in range(M_SIZE):
        for j in range(M_SIZE):
            if key[i][j] == 1:
                enc[i] = enc[i] ^^ ptxt[j]
    return binascii.hexlify(bytes(enc))
# turn flag into a matrix
inter_key = bin(int(flag.encode('ascii').hex(), 16))[2:].rjust(FLAG_LEN * 8, '0')
key = [[int(c) for c in l] for l in chunks(inter_key, M_SIZE)]
c = b''.join([encrypt(i) for i in chunks(flag, M_SIZE)])
FLAG_LEN = 72
# turn flag into a matrix
inter_key = bin(int(flag.encode('ascii').hex(), 16))[2:].rjust(FLAG_LEN * 8, '0')
key = [[int(c) for c in l] for l in chunks(inter_key, M_SIZE)]
c = b''.join([encrypt(i) for i in chunks(flag, M_SIZE)])
import binascii

msg =  b'Reaction and diffusion of chemical species can produce a variety of patterns, reminiscent of those often seen in nature. The Gray Scott equations model such a reaction. For more information on this chemical system see the articles "Complex Patterns in a Simple System," by John E. Pearson and "Pattern Formation by Interacting Chemical Fronts," by K.J. Lee, W.D. McCormick, Qi Ouyang, and H.L. Swinney. These articles appeared in Science, Volume 261, 9 July 1993.\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11\x11'
c = b''.join([encrypt(i) for i in chunks(msg, M_SIZE)])
c
cibits = [[(2^i)&j for j in bytes.fromhex(c.decode('ascii'))] for i in range(8)]
cibits = [[1 if j > 0 else 0 for j in i] for i in cibits]
cibits
cibits = [i for j in cibits for i in chunks(j,8)]
cibits
MS = MatrixSpace(GF(2),24)
cibits = [[(2^i)&j for j in pad(msg)] for i in range(8)]
msg
ibits = [[(2^i)&j for j in (msg)] for i in range(8)]
ibits
ibits = [[1 if j > 0 else 0 for j in i] for i in ibits]
ibits = [i for j in ibits for i in chunks(j,8)]
MatrixSpace(GF(2),160,24)
MST = _
MST(ibits).transpose()
P = _
C = MST(cibits).transpose()
ibits = [i for i in chunks(ibits, 24)]
cibits = [i for i in chunks(cibits, 24)]
ibits
cibits = [i for j in cibits for i in j]
cibits = [i for j in cibits for i in j]
ibits = [i for j in ibits for i in j]
ibits = [i for j in ibits for i in j]
ibits = [i for i in chunks(ibits, 24)]
cibits = [i for i in chunks(cibits, 24)]
ibits
MST(ibits).transpose()
P = _
C = MST(cibits).transpose()
P.solve_left(C)
A = _
A.str()
A.inverse()
