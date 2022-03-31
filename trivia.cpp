#include <iostream>
#include <string>
using namespace std;

int main() {
    string question1;
    cout << "Who am I? \n";
    cin >> question1;

    if (question1 == "Jacob Berger") {
        cout << "Correct! Next Question";
    }else {
        return 0;
    }

    string question2;
    cout << "What is 1+1*2?";
    cin >> question2;

    if (question2 == "3") {
        cout << "Correct! Next Question";
    }else {
        return 0;
    }

    string question3;
    cout << "How many letters were in the Latin alphabet used by the Romans during the Classical Latin period";
    cin >> question3;

    if (question3 == "23") {
        cout << "Correct! Next Question";
    }else {
        return 0;
    }

    string question4;
    cout << "What is the capital of Turkey? \n";
    cin >> question4;

    if (question4 == "Ankara") {
        cout << "Correct! Next Question";
    }else {
        return 0;
    }

    string question5;
    cout << "Who is Hades's wife?";
    cin >> question5;

    if (question5 == "Persephone") {
        cout << "Correct! Next Question";
    }else {
        return 0;
    }

    string question6;
    cout << "What is the name of the youngest Titan's only non-god child? \n";
    cin >> question6;

    if (question6 == "Chiron") {
        cout << "Correct! Next Question";
    }else {
        return 0;
    }

    cout << "Here is the flag: bcactf{TR1VI4_G4ME_C0M9L3T3D_746136}";

    return 0;
}