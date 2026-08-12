#include <iostream>
#include <string>
#include <cctype>
using namespace std;

string vigenere(const string& text, const string& key, bool decrypt=false) {
    string out; size_t j=0;
    for(char c:text){
        if(isalpha(static_cast<unsigned char>(c))){
            int base=isupper(static_cast<unsigned char>(c))?'A':'a';
            int shift=toupper(static_cast<unsigned char>(key[j%key.size()]))-'A';
            if(decrypt) shift=-shift;
            out += char((c-base+shift+260)%26+base);
            ++j;
        } else out+=c;
    }
    return out;
}
int main(){
    string text,key;
    cout<<"Enter text: "; getline(cin,text);
    cout<<"Enter key: "; getline(cin,key);
    if(key.empty()){cerr<<"Key cannot be empty.\n"; return 1;}
    string enc=vigenere(text,key);
    cout<<"Encrypted: "<<enc<<"\n";
    cout<<"Decrypted: "<<vigenere(enc,key,true)<<"\n";
}