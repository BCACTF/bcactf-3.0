#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#define NOTE_COUNT 8
#define FLAG_BUFFER 100

typedef char* NoteContent;

NoteContent notes[NOTE_COUNT];

int selectNoteIndex() {
    int idx = 0;
    puts("Please choose a note (1 to 8 inclusive)");
    scanf("%d", &idx);
    if (idx <= 0 || idx >= NOTE_COUNT) {
        puts("Invalid note index! Index must be from 1 to 8 (inclusive)");
        return -1;
    }
    printf("%d\n", idx);
    return idx - 1;   
}

void printNote() {
    int idx = selectNoteIndex();
    if (idx == -1) return;
    puts("Printing note\n");
    puts(notes[idx]);
}

void deleteNote() {
    int idx = selectNoteIndex();
    if (idx == -1) return;
    free(notes[idx]);
    puts("Note has been deleted");
}

void createNote() {
    int idx = selectNoteIndex();
    if (idx == -1) return;
    notes[idx] = (NoteContent) malloc(16);
    NoteContent note = notes[idx];
    if (note == NULL) {
        puts("No space for note? Exitting.");
        return exit(1);
    }
    puts("Note has been created");
    printf("%p\n", note);
}

void write2Note() {
    int idx = selectNoteIndex();
    if (idx == -1) return;
    NoteContent note = notes[idx];
    printf("%p\n", note);
    printf("Send note content for note #%d\n", idx + 1);
    scanf("%15s", note);
    notes[idx] = note;
    puts("Note has been written to");
}


int menu() {
    puts("\n]=======[ MENU ]=======[");
    puts("] 1) Print a note      [");
    puts("] 2) Delete note       [");
    puts("] 3) Create a note     [");
    puts("] 4) Write to a note   [");
    puts("]======================[");
    puts("Please choose an option (1, 2, 3, 4)");
    int res = 0;
    scanf("%d", &res);
    puts("");
    return res - 1;
}

void printflag() {
    puts("bcactf{not_the_actual_flag}");
}

int main() {
    int magic = -1;
    while (1) {
        if (magic == 0x67344C66) {
            printflag();
            return 0;
        }

        switch (menu()) {
            case 0:
                printNote();
                break;
            case 1:
                deleteNote();
                break;
            case 2:
                createNote();
                break;
            case 3:
                write2Note();
                break;
            default:
                puts("Invalid option");
                return 0;
        }
    }
    return 0;
}