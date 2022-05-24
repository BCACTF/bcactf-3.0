#include <stdio.h>
#include <stdlib.h>

float jumps = 0;

void b() {
    if (jumps != 1.234) return;
    
    FILE *fptr = fopen("flag.txt", "r");
    char flag[100];
    if(fptr == NULL){
        printf("\nLooks like we've run out of jump ropes...\n");
        printf("Challenge is misconfigured. Please contact admin if you see this.\n");
        return;
    }
    puts("Wow, how do you manage to jump 1.234 times. Guess we might need to return those jump ropes...\n");
    fgets(flag, sizeof(flag), fptr);
    puts(flag);
}

void ropjump(){
    char arr[100];
    printf("\nBetter start jumping!\n");
    gets(arr);
    jumps += 1.0;
    printf("Woo, that was quite the workout wasn't it!\n");
}

int main() {
    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    printf("Today, we are going to be testing out our new jump ropes!\n");
    printf("Make sure to have a spotter so you don't get hurt!\n");
    ropjump();

    return 1;
}
