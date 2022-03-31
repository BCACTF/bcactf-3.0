flag = "bcactf{ch4r4ct3r_fr3qu3ncy_15_50_c00l_55aFejnb}"
keys = "abcdefghijklmnopqrstuvwxyz0123456789.?!<>@#$%^&"
f = open('hidden-frequencies/msg.txt', 'w')
ascval = []

for let in flag:
    ascval.append(ord(let))

keypos = 0
for entry in ascval:
    for x in range(0, entry):
        f.write(keys[keypos])
    keypos += 1



