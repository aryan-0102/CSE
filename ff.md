#include <bits/stdc++.h>
using namespace std;

map<char, vector<string>> prod;
map<char, set<char>> FIRST, FOLLOW;
set<char> nonterm;

bool isNonTerm(char c) { return c >= 'A' && c <= 'Z'; }

void computeFIRST() {
    bool changed = true;
    while (changed) {
        changed = false;
        for (auto &p : prod) {
            char A = p.first;
            for (auto &rhs : p.second) {
                if (rhs == "e") {
                    if (FIRST[A].insert('e').second) changed = true;
                    continue;
                }
                bool allNullable = true;
                for (char X : rhs) {
                    if (!isNonTerm(X)) {
                        if (FIRST[A].insert(X).second) changed = true;
                        allNullable = false;
                        break;
                    }
                    for (char t : FIRST[X])
                        if (t != 'e' && FIRST[A].insert(t).second) changed = true;
                    if (!FIRST[X].count('e')) { allNullable = false; break; }
                }
                if (allNullable)
                    if (FIRST[A].insert('e').second) changed = true;
            }
        }
    }
}

void computeFOLLOW(char start) {
    FOLLOW[start].insert('$');

    bool changed = true;
    while (changed) {
        changed = false;
        for (auto &p : prod) {
            char A = p.first;
            for (auto &rhs : p.second) {
                for (int i = 0; i < rhs.size(); i++) {
                    char B = rhs[i];
                    if (!isNonTerm(B)) continue;

                    bool nullableSuffix = true;
                    for (int j = i + 1; j < rhs.size(); j++) {
                        char X = rhs[j];
                        if (!isNonTerm(X)) {
                            if (FOLLOW[B].insert(X).second) changed = true;
                            nullableSuffix = false;
                            break;
                        }
                        for (char t : FIRST[X])
                            if (t != 'e')
                                if (FOLLOW[B].insert(t).second) changed = true;

                        if (!FIRST[X].count('e')) { nullableSuffix = false; break; }
                    }
                    if (nullableSuffix)
                        for (char t : FOLLOW[A])
                            if (FOLLOW[B].insert(t).second) changed = true;
                }
            }
        }
    }
}

int main() {
    int n; cin >> n;
    string p;
    getline(cin, p);

    for (int i = 0; i < n; i++) {
        getline(cin, p);
        char A = p[0];
        nonterm.insert(A);
        int pos = p.find("->");
        string rhs = p.substr(pos + 2);
        stringstream ss(rhs);
        string alt;
        while (getline(ss, alt, '|')) {
            alt.erase(remove_if(alt.begin(), alt.end(), ::isspace), alt.end());
            prod[A].push_back(alt);
        }
    }

    computeFIRST();
    computeFOLLOW(*nonterm.begin());

    cout << "FIRST:\n";
    for (auto &x : FIRST) {
        cout << x.first << ": ";
        for (char c : x.second) cout << c << " ";
        cout << "\n";
    }

    cout << "FOLLOW:\n";
    for (auto &x : FOLLOW) {
        cout << x.first << ": ";
        for (char c : x.second) cout << c << " ";
        cout << "\n";
    }
}
