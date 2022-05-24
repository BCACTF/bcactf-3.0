#include <stdlib.h>
#include <stdio.h>

int main() {
    char buf[20];

    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    puts("Got libc?");
    gets(buf);
}