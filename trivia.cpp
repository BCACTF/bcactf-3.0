#include <iostream>
#include <string>
using namespace std;

int main() {
    string question1;
    cout << "What is my first name? \n";
    cin >> question1;

    if (question1 == "Jacob") {
        cout << "Correct! Next Question: \n";
    }else {
        return 0;
    }

    string question2;
    cout << "What is 1+1*2? \n";
    cin >> question2;

    if (question2 == "3") {
        cout << "Correct! Next Question \n";
    }else {
        return 0;
    }

    string question3;
    cout << "How many letters were in the Latin alphabet used by the Romans during the Classical Latin period \n";
    cin >> question3;

    if (question3 == "23") {
        cout << "Correct! Next Question \n";
    }else {
        return 0;
    }

    string question4;
    cout << "What is the capital of Turkey? \n";
    cin >> question4;

    if (question4 == "Ankara") {
        cout << "Correct! Next Question \n";
    }else {
        return 0;
    }

    string question5;
    cout << "Who is Hades's wife? \n";
    cin >> question5;

    if (question5 == "Persephone") {
        cout << "Correct! Next Question \n";
    }else {
        return 0;
    }

    string question6;
    cout << "What is the name of the youngest Titan's only non-god child? \n";
    cin >> question6;

    if (question6 == "Chiron") {
        cout << "Correct! \n";
    }else {
        return 0;
    }

    cout << "Cipher text: ";
    cout << "VSVNXXFYCRCZCSQSVVHEQNGVVWGDSOLFLW\n" << endl;
    cout << "Important info: " << endl;
    cout << "VTNBCZMQYGPKUIFDXSROHLEAW" << endl;
    cout << "WIHYRVGQEPSLFNXBMTDACUZKO" << endl;
    cout << "Don't forget to add curly brackets, put underscores between words, and make all letters lowercase!" << endl;
    string leaveopen;
    cin >> leaveopen;
    return 0;
}