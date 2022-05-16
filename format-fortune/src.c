#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void printflag() {
    FILE *fptr = fopen("flag.txt", "r");
    char flag[100];
    if(fptr == NULL){
        puts("Please add flag.txt to the present working directory to test this file.\n");
        puts("If you see this on the remote server, please contact admin.");
    }

    fgets(flag, sizeof(flag), fptr);
    puts(flag);
}
int magic = 0;
int main() {
    char buf[50]; 

    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    puts("Hi, what's your name? ");
    fgets(buf, 50, stdin);

    printf("Welcome to my game of luck, ");
    printf(buf);
    sleep(1);
    puts("Testing your luck... please wait");
    sleep(2);
    if (magic == 0xBEEF) {
        puts("\nToday's your lucky day! You've won a flag");
        printflag();
    } else puts("\nSadly you are not lucky enough... no flag today");

    return 1;
}
