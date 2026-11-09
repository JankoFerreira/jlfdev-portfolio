(() => {
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
const words=[...document.querySelectorAll(".ignition-word")];
for(const word of words){
 const text=word.textContent;word.setAttribute("aria-label",text);word.replaceChildren();
 for(const letter of text){const span=document.createElement("span");span.className="letter-burst";span.textContent=letter;span.setAttribute("aria-hidden","true");word.append(span);}
}
const titles=[...document.querySelectorAll(".hero h1,.section-heading h2")];
const observer=new IntersectionObserver(entries=>{
 for(const entry of entries){if(entry.intersectionRatio<.65||reduced.matches)continue;
 entry.target.querySelectorAll(".letter-burst").forEach((letter,i)=>{letter.getAnimations().forEach(a=>a.cancel());letter.animate([{transform:"translate("+((i%4-1.5)*14)+"px,"+(i%2?35:-35)+"px) rotate("+(i%2?22:-22)+"deg)",opacity:.3},{transform:"none",opacity:1}],{duration:750,delay:Math.min(i*18,300),easing:"cubic-bezier(.18,1.3,.36,1)"});});
 }
},{threshold:.65});titles.forEach(title=>observer.observe(title));
document.addEventListener("click",event=>{
 const button=event.target.closest("button,a");if(!button||reduced.matches)return;
 const rect=button.getBoundingClientRect();const x=event.detail?event.clientX:rect.left+rect.width/2;const y=event.detail?event.clientY:rect.top+rect.height/2;
 for(let i=0;i<12;i++){const spark=document.createElement("i");spark.className="click-spark";spark.style.left=x+"px";spark.style.top=y+"px";document.body.append(spark);const angle=i*Math.PI/6;const distance=28+(i%3)*14;const animation=spark.animate([{transform:"translate(0,0) rotate("+angle+"rad)",opacity:1},{transform:"translate("+Math.cos(angle)*distance+"px,"+Math.sin(angle)*distance+"px) rotate("+angle+"rad)",opacity:0}],{duration:420,easing:"ease-out"});animation.onfinish=()=>spark.remove();}
});
})();