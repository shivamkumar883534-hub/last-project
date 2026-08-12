const Crypto = (() => {
  function caesar(text, shift) {
    shift=((shift%26)+26)%26; let out="", steps=[];
    for(let i=0;i<text.length;i++){
      const c=text[i], code=c.charCodeAt(0);
      let t=c;
      if(code>=65&&code<=90)t=String.fromCharCode((code-65+shift+26)%26+65);
      else if(code>=97&&code<=122)t=String.fromCharCode((code-97+shift+26)%26+97);
      out+=t;
      if(c!==t) steps.push(`${i+1}. ${c} → ${t} (shift ${shift})`);
    }
    return {result:out,steps};
  }

  function vigenere(text,key,decrypt=false){
    key=key.replace(/[^a-z]/gi,"").toUpperCase();
    if(!key) throw new Error("Vigenère key must contain letters.");
    let out="", steps=[], j=0;
    for(let i=0;i<text.length;i++){
      const c=text[i], code=c.charCodeAt(0);
      if(!((code>=65&&code<=90)||(code>=97&&code<=122))){out+=c;continue}
      const shift=(key.charCodeAt(j%key.length)-65)*(decrypt?-1:1);
      const base=code>=65&&code<=90?65:97;
      const t=String.fromCharCode((code-base+shift+26*10)%26+base);
      out+=t; steps.push(`${i+1}. ${c} → ${t} using key ${key[j%key.length]}`); j++;
    }
    return {result:out,steps};
  }

  // Compact, dependency-free SHA-256 implementation.
  function sha256(ascii){
    const rightRotate=(v,a)=>(v>>>a)|(v<<(32-a));
    const mathPow=Math.pow, maxWord=mathPow(2,32), result=[], words=[];
    let asciiBitLength=ascii.length*8;
    let hash=[], k=[], primeCounter=0, isComposite={};
    for(let candidate=2;primeCounter<64;candidate++){
      if(!isComposite[candidate]){
        for(let i=0;i<8;i++)hash[i]=hash[i]||0;
        if(primeCounter<8) hash[primeCounter]=mathPow(candidate,.5)*maxWord|0;
        k[primeCounter]=(mathPow(candidate,1/3)*maxWord)|0; primeCounter++;
        for(let i=candidate*candidate;i<313;i+=candidate)isComposite[i]=true;
      }
    }
    ascii += "\x80";
    while(ascii.length%64-56) ascii+="\x00";
    for(let i=0;i<ascii.length;i++){
      const j=i>>2; words[j]=(words[j]||0)|ascii.charCodeAt(i)<<((3-i%4)*8);
    }
    words.push((asciiBitLength/maxWord)|0,asciiBitLength>>>0);
    for(let i=0;i<words.length;){
      const w=words.slice(i,i+=16), old=hash.slice(0);
      for(let j=16;j<64;j++){
        const s0=rightRotate(w[j-15],7)^rightRotate(w[j-15],18)^(w[j-15]>>>3);
        const s1=rightRotate(w[j-2],17)^rightRotate(w[j-2],19)^(w[j-2]>>>10);
        w[j]=(w[j-16]+s0+w[j-7]+s1)|0;
      }
      let a=hash[0],b=hash[1],c=hash[2],d=hash[3],e=hash[4],f=hash[5],g=hash[6],h=hash[7];
      for(let j=0;j<64;j++){
        const S1=rightRotate(e,6)^rightRotate(e,11)^rightRotate(e,25);
        const ch=(e&f)^((~e)&g);
        const temp1=(h+S1+ch+k[j]+w[j])|0;
        const S0=rightRotate(a,2)^rightRotate(a,13)^rightRotate(a,22);
        const maj=(a&b)^(a&c)^(b&c);
        const temp2=(S0+maj)|0;
        h=g;g=f;f=e;e=(d+temp1)|0;d=c;c=b;b=a;a=(temp1+temp2)|0;
      }
      hash=[(hash[0]+a)|0,(hash[1]+b)|0,(hash[2]+c)|0,(hash[3]+d)|0,(hash[4]+e)|0,(hash[5]+f)|0,(hash[6]+g)|0,(hash[7]+h)|0];
    }
    for(let i=0;i<hash.length;i++) result.push(("00000000"+(hash[i]>>>0).toString(16)).slice(-8));
    return result.join("");
  }

  const freq=[8.167,1.492,2.782,4.253,12.702,2.228,2.015,6.094,6.966,0.153,0.772,4.025,2.406,6.749,7.507,1.929,0.095,5.987,6.327,9.056,2.758,0.978,2.360,0.150,1.974,0.074];
  function brute(text){
    const candidates=[];
    for(let s=0;s<26;s++){
      const r=caesar(text,-s).result;
      const counts=Array(26).fill(0); let total=0;
      for(const ch of r.toUpperCase()) if(ch>='A'&&ch<='Z'){counts[ch.charCodeAt(0)-65]++;total++}
      let score=0;
      if(total) for(let i=0;i<26;i++){const expected=total*freq[i]/100;score+=(counts[i]-expected)**2/(expected||1)}
      candidates.push({shift:s,text:r,score:score});
    }
    candidates.sort((a,b)=>a.score-b.score);
    return candidates;
  }
  return {caesar,vigenere,sha256,brute};
})();