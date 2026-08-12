let mode="encrypt";
const $=id=>document.getElementById(id);
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showPage(b.dataset.go));

$("themeBtn").onclick=()=>{
  const light=document.documentElement.getAttribute("data-theme")==="light";
  document.documentElement.setAttribute("data-theme",light?"dark":"light");
  $("themeBtn").textContent=light?"🌙":"☀️";
};
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{
  mode=b.dataset.mode;
  document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));
});

$("algorithm").onchange=()=>{
  const a=$("algorithm").value;
  $("modeWrap").style.display=(a==="sha256"||a==="brute")?"none":"block";
  $("keyWrap").style.display=(a==="caesar"||a==="vigenere")?"block":"none";
  if(a==="caesar"){$("keyLabel").textContent="Shift Key (0–25)";$("key").type="number";$("key").value=3}
  if(a==="vigenere"){$("keyLabel").textContent="Keyword";$("key").type="text";$("key").value="LEMON"}
};
$("run").onclick=()=>{
  const text=$("input").value;
  if(!text.trim()){alert("Please enter text.");return}
  const a=$("algorithm").value, start=performance.now();
  let result="", steps=[];
  try{
    if(a==="caesar"){const r=Crypto.caesar(text,Number($("key").value)*(mode==="decrypt"?-1:1));result=r.result;steps=r.steps}
    else if(a==="vigenere"){const r=Crypto.vigenere(text,$("key").value,mode==="decrypt");result=r.result;steps=r.steps}
    else if(a==="sha256"){result=Crypto.sha256(text);steps=[`Input length: ${text.length} characters`,`SHA-256 digest: 256 bits`,`Hex output length: ${result.length} characters`,`Hashing is one-way; there is no decrypt operation.`]}
    else {const c=Crypto.brute(text);result=c[0].text;steps=c.slice(0,10).map((x,i)=>`Rank ${i+1}: shift ${x.shift}, score ${x.score.toFixed(2)} → ${x.text}`)}
    $("output").textContent=result;
    $("time").textContent=`⏱ ${(performance.now()-start).toFixed(2)} ms`;
    $("entropy").textContent=`📊 ${entropy(result).toFixed(2)} bits/char`;
    $("steps").innerHTML=steps.map(s=>`<div class="step">${escapeHtml(s)}</div>`).join("");
  }catch(e){alert(e.message)}
};
$("clear").onclick=()=>{$("input").value="";$("output").textContent="Your result will appear here...";$("steps").innerHTML='<p class="muted">Run an operation to see the steps.</p>'};
$("copy").onclick=async()=>{if($("output").textContent)try{await navigator.clipboard.writeText($("output").textContent);alert("Copied!")}catch{}};
$("contactForm").onsubmit=e=>{e.preventDefault();$("contactStatus").textContent="Message form submitted successfully (demo mode).";e.target.reset()};

function entropy(s){
  if(!s)return 0; const m={}; for(const c of s)m[c]=(m[c]||0)+1;
  return Object.values(m).reduce((x,n)=>x-(n/s.length)*Math.log2(n/s.length),0);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
