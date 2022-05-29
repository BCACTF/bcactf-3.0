#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>

int echo() {
    char input[26];

    fgets(input, 26, stdin);
    if (strlen(input) <= 1) return 1;

    sleep(1);
    printf(input);

    return 0;
}

int main() {
    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    puts("Welcome to my ECHO server! Enjoy.");

    while (echo() == 0) {}

    puts("Goodbye.");

    return 0;
}