import marshal
#password is ii?K.5fDPRSNtH6K


def main():
    # wrap your flag in bcactf{}
    b = bytearray.fromhex(
        "1536857675937743771546d367f38636471677f2d6f636e25626574757f697e2777777f2f2a33707474786"[::-1]).decode()
    _q = "N9KwQV"
    _w = "1NBl"
    _e = "USGi8"
    _t = '4633c6b4361307'
    _r = "l7"
    r = _q + _e + _w + _r
    x = ""
    for z in r:
        x += chr(ord(z) - 3)
    i = input("Enter password: ")
    if i == x[::-1][1:]:
        c = "aJ4Dz4h5"
        print(bytearray.fromhex(_t[::-1]).decode() + "_" + c[::-1] + r[4:])
    else:
        print("Incorrect")


with open('data.ctf', 'wb') as fh:
    fh.write(marshal.dumps(main.__code__))

data = open("data.ctf", "rb").read()
with open('data.ctf', 'wb') as fh:
    fh.write(marshal.dumps(data))
