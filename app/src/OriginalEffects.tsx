import {useEffect,useRef,useState} from 'react';
import {mountBackground} from './background';
export function Loader(){
 const [done,setDone]=useState(false);
 useEffect(()=>{
  document.body.classList.add('loaded');
  let seen=false;try{seen=sessionStorage.getItem('jlf-intro-seen')==='1';sessionStorage.setItem('jlf-intro-seen','1');}catch{/* Storage may be disabled. */}
  const timer=window.setTimeout(()=>setDone(true),seen||matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);
  return ()=>clearTimeout(timer);
 },[]);
 if(done)return null;
 return <div className="intro-lite" aria-hidden="true"><div><span>JLF / PORTFOLIO</span><strong>Janko Ferreira</strong><i/></div></div>;
}
const roles=['Full Stack Developer','Web Developer','AI-Optimized Web Developer','Digital Solutions Builder'];
export function RoleRotator(){
 const [word,setWord]=useState(roles[0]);const host=useRef<HTMLSpanElement>(null);
 useEffect(()=>{let timer=0,index=0,length=roles[0].length,deleting=true,visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function step(){if(!visible||document.hidden||reduced.matches)return;length+=deleting?-1:1;setWord(roles[index].slice(0,length));let delay=deleting?52:68;if(length===0){index=(index+1)%roles.length;deleting=false;delay=280;}else if(length===roles[index].length){deleting=true;delay=2400;}timer=window.setTimeout(step,delay);}
 function sync(){clearTimeout(timer);if(visible&&!document.hidden&&!reduced.matches)timer=window.setTimeout(step,1100);}
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host.current!);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 return ()=>{clearTimeout(timer);observer.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};},[]);
 return <span ref={host} className="highlight name-glow hero-roles-rotator" aria-label="Full stack developer, web developer and digital solutions builder"><span className="hero-roles-word" aria-hidden="true">{word}</span></span>;
}
export function useOriginalInteractions(){useEffect(()=>{
 const controller=new AbortController();const {signal}=controller;const stopBackground=mountBackground();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('active');reveal.unobserve(entry.target);}}),{threshold:0,rootMargin:'0px 0px -30px 0px'});
 document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right').forEach(el=>reveal.observe(el));
 const motion=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-paused',!entry.isIntersecting)),{rootMargin:'100px'});document.querySelectorAll('section').forEach(el=>motion.observe(el));
 const hidden=()=>document.body.classList.toggle('page-paused',document.hidden);document.addEventListener('visibilitychange',hidden,{signal});hidden();
 const menu=document.getElementById('sideMenu');const toggle=document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
 function setMenu(open:boolean){menu?.classList.toggle('is-open',open);menu?.setAttribute('aria-hidden',String(!open));if(menu)menu.inert=!open;toggle?.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)menu?.querySelector<HTMLElement>('a')?.focus();}
 setMenu(false);toggle?.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'),{signal});menu?.addEventListener('click',event=>{if((event.target as Element).closest('a,button'))setMenu(false);},{signal});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus();}},{signal});
 const top=document.getElementById('backToTop');const home=document.getElementById('home');const topObserver=new IntersectionObserver(([entry])=>{top?.classList.toggle('show',!entry.isIntersecting);top?.classList.toggle('visible',!entry.isIntersecting);top?.setAttribute('aria-hidden',String(entry.isIntersecting));if(top)top.tabIndex=entry.isIntersecting?-1:0;});if(home)topObserver.observe(home);top?.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}),{signal});
 const form=document.querySelector<HTMLFormElement>('#contactForm');const button=document.querySelector<HTMLButtonElement>('#sendBtn');const status=document.getElementById('formStatus');let sending=false;
 form?.addEventListener('submit',async event=>{event.preventDefault();if(sending||!button)return;sending=true;button.disabled=true;button.classList.add('sending');if(status)status.textContent='Sending your message.';try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal});if(!response.ok)throw Error('Submission failed');form.reset();button.classList.add('sent');if(status)status.textContent='Message sent successfully.';}catch{if(!signal.aborted&&status)status.textContent='Message failed to send. Please try again or email me directly.';}finally{sending=false;button.disabled=false;button.classList.remove('sending');}},{signal});
 return ()=>{controller.abort();stopBackground();reveal.disconnect();motion.disconnect();topObserver.disconnect();document.body.classList.remove('menu-open','page-paused');};
},[]);}
