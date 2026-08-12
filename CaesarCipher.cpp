#include <iostream>
#include <string>
#include <cctype>
using namespace std;

string caesar(const string& text, int shift) {
    shift = (shift % 26 + 26) % 26;
    string out = text;
    for (char &c : out) {
        if (isupper(static_cast<unsigned char>(c)))
            c = char('A' + (c - 'A' + shift) % 26);
        else if (islower(static_cast<unsigned char>(c)))
            c = char('a' + (c - 'a' + shift) % 26);
    }
    return out;
}
int main() {
    string text; int shift;
    cout << "Enter text: "; getline(cin, text);
    cout << "Enter shift: "; cin >> shift;
    string encrypted=caesar(text,shift);
    cout << "Encrypted: " << encrypted << '\n';
    cout << "Decrypted: " << caesar(encrypted,-shift) << '\n';
}