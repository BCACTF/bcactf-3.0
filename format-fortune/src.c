#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int magic = 0;

void printflag() {
    FILE *fptr = fopen("flag.txt", "r");
    char flag[100];
    if(fptr == NULL){
        puts("Come on... Unfortunately we forgot the flag... get it, unfortunately - ha ha ha.\n");
        puts("Anyways, challenge is misconfigured. Please contact admin.");
    }

    fgets(flag, sizeof(flag), fptr);
    puts(flag);
}

int main() {
    char buf[50]; 

    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    printf("Welcome to my casino! You look like you want to throw your life savings away...\n");
    printf("Don't tell anyone, but around here, the house ALWAYS wins.\n");
    printf("Give it a try! But first, what's your name?\n");
    fgets(buf, 50, stdin);
    printf("Well, good luck, ");
    printf(buf);
    sleep(1);
    puts("Testing your luck... please wait");
    sleep(2);
    if (magic == 0xBEEF) {
        puts("\nI'm impressed! You've won a flag");
        printflag();
    } else puts("\I warned you! No flag today.");

    return 1;
}
