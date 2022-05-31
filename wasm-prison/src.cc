

#include <cstdlib>
#include <cstdio>
#include <functional>

std::function<int(int)> checks[256];

// char* decodedFlag = "bcactf{th3_1nd1r3ct_PR1S0N_95c3b0}";
const char* encodedFlag = "bcactf{\xCF\x41\x99\xD1\x0D\x61\x2B\x2D\x83\x81\x69\xF5\xD9\x69\xA3\xDD\xC1\x51\x1B\x51\xFD\x71\x21\xC9\x23\x01}";

extern "C" {
  int isCorrect(char*, int);
}

int isCorrect(char* str, int len) {
    if (len != strlen(encodedFlag)) return false;
    for (int i = 0; i < len; ++i) {
        if (checks[str[i] ^ 137](i) == 0) return false;
    }

    return true;
}

int main() {
    int byt;
    for (byt = 0; byt < 256; ++byt) {
        checks[byt ^ 137] = [byt](int idx) {
            if (idx < 7 || idx == 33) return byt == encodedFlag[idx] ? 1 : 0;
            return ((byt * 1337 + 1 + idx) & 0xFF) == (encodedFlag[idx] & 0xFF) ? 1 : 0;
        };
    };

    return 0;
}