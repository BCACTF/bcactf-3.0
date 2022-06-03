#include <stdio.h>
#include <stdlib.h>

#define FLAG_BUFFER 100

int main() {
    char flag[FLAG_BUFFER];
    FILE *fp = NULL;
    int balance = 10;
    int option = 0, count = 0, total = 0;

    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    do {
        printf("Hi, welcome to Pwning 101.\nYour balance is $%d. Please select an item:\n", balance);
        puts("1. Buy a hamster ($1)");
        puts("2. Buy the flag ($100)");
        printf("(1 or 2)> ");
        scanf("%d", &option);

        if (option == 1) {
            if (balance < 1) {
                printf("Not enough money! You have $%d\n", balance);
                return 1;
            }
            printf("Amount? ");
            scanf("%d", &count);

            balance -= count * 1;
            total += count;

            printf("Done, you now have %d hamsters\n", total);
        } else if (option == 2) {
            if (balance < 100) {
                printf("Not enough money! You have $%d\n", balance);
                return 1;
            }

            fp = fopen("flag.txt", "r");
            if (fp == NULL) {
                puts("If you see this, please contact admin.");
                return 1;
            }

            fgets(flag, FLAG_BUFFER, fp);

            puts("\nWell... You've made it to the land of Pwn");
            printf("Here's your flag: %s\n", flag);
            return 0;
        } else break;
    } while (1);

    puts("Unknown option. Goodbye");
    return 1;
}