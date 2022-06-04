

#include <cstdlib>
#include <cstdio>
#include <functional>

std::function<int(int)> checks[256];

// char* decodedFlag = "bcactf{th3_1nd1r3ct_PR1S0N_95c3b0}";
const char* encodedFlag = "bcactf{\xdc\x31\x65\x32\xf5\x8b\x52\xf8\x72\x6c\x1d\xe7\x3b\xe5\x58\x0\x93\xc9\x78\x42\xcd\xea\x29\x7a\xf2\xd1}";

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