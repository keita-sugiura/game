#include<bits/stdc++.h>
using namespace std;
int main(){
    int n=10000;
    vector<int>v;
    for(int i=2;i<=n;i++){
        bool ok=true;
        for(int j=2;j<i;j++)if(i%j==0)ok=false;
        if(ok)v.push_back(i);
    }
    for(int i=1;i<=n;i++){
        if(i>100&&i<9900)continue;
        cout<<i<<' ';
        int t=i;
        if(i==1){
            cout<<1<<"\n";
            continue;
        }
        for(auto au:v){
            while(t%au==0){
                t/=au;
                cout<<au<<' ';
            }
        }
        cout<<"\n";
    }
}
