#include <iostream>
#include <string>
#include <cctype>
using namespace std;
string caesar(const string&s,int sh){string o=s;sh=(sh%26+26)%26;for(char&c:o){if(isupper((unsigned char)c))c='A'+(c-'A'+sh)%26;else if(islower((unsigned char)c))c='a'+(c-'a'+sh)%26;}return o;}
int main(){string c;cout<<"Enter Caesar ciphertext: ";getline(cin,c);for(int s=0;s<26;s++)cout<<"Shift "<<s<<": "<<caesar(c,-s)<<"\n";}