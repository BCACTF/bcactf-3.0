#include <string.h>
#include <stdio.h>
#define EXIT(STATUS, STR) puts(STR);\
	return STATUS
char *raw1 ="\x99\xa1\xa2\xee\xf0\x6e\x9e\xc0\x84\x80\x5b\x91\x61\x7a\x2b\x0b\x37\x38\xd0\xe5\x94\x0b\xb5\xb1\x36\xb3\x24\x2d\x83\x0b\xeb";
char *raw2 ="\xfb\xc2\xc3\x8d\x84\x08\xe5\xa6\xe8\xb4\x1c\xce\x34\x14\x4f\x38\x45\x74\xe0\xd5\xff\x6e\xf1\xee\x53\x84\x40\x4b\xba\x68\x96";
int main(int argc, char** argv) {
	if (argc != 2) {
		printf("Usage for flag checker: %s <flag>\n", argv[0]);
		EXIT(1, "Exitting");
	}

	char* flag = argv[1];
	puts("Welcome to my flag checker :)");
	if (strlen(flag) != 31) {
		EXIT(1, "Incorrect flag.");
	} else {
		for (int i = 0; i < 31; ++i) {
			if ((raw2[i] ^ flag[i]) != raw1[i]) {
				EXIT(1, "Incorrect flag");
			}
		}
	}
	EXIT(0, "Correct! That is the correct flag");
}