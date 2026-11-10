import {useEffect,useRef,useState} from 'react';

export function CustomPointer(){
 const pointer=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=pointer.current!;const fine=matchMedia('(hover: hover) and (pointer: fine)');const controller=new AbortController();let frame=0,x=0,y=0;
  const hide=()=>{document.documentElement.classList.remove('custom-pointer-active');node.classList.remove('is-visible');cancelAnimationFrame(frame);frame=0;};
  const move=(event:PointerEvent)=>{
   if(!fine.matches||event.pointerType==='touch')return hide();
   const target=event.target instanceof Element?event.target:null;
   if(target?.closest('input,textarea,[contenteditable="true"],dialog'))return hide();
   x=event.clientX;y=event.clientY;
   node.classList.toggle('is-link',!!target?.closest('a,button,[role="button"],.sg-globe'));
   node.classList.add('is-visible');document.documentElement.classList.add('custom-pointer-active');
   if(!frame)frame=requestAnimationFrame(()=>{frame=0;node.style.transform=`translate3d(${x}px,${y}px,0)`;});
  };
  window.addEventListener('pointermove',move,{passive:true,signal:controller.signal});
  window.addEventListener('pointerdown',()=>node.classList.add('is-pressed'),{passive:true,signal:controller.signal});
  window.addEventListener('pointerup',()=>node.classList.remove('is-pressed'),{passive:true,signal:controller.signal});
  window.addEventListener('blur',hide,{signal:controller.signal});document.documentElement.addEventListener('pointerleave',hide,{signal:controller.signal});
  document.addEventListener('visibilitychange',hide,{signal:controller.signal});fine.addEventListener('change',hide,{signal:controller.signal});
  return ()=>{hide();controller.abort();};
 },[]);
 return <div ref={pointer} className="custom-pointer" aria-hidden="true"><span className="pointer-ring"/><span className="pointer-dot"/></div>;
}

const commands=[{label:'Home',hint:'Back to the introduction',id:'home'},{label:'About me',hint:'The person behind the code',id:'about'},{label:'Tech Globe',hint:'Explore my skills',id:'skills'},{label:'Projects',hint:'See what I have built',id:'work'},{label:'Journey',hint:'Experience and education',id:'journey'},{label:'Contact',hint:'Let us build something',id:'contact'}];
export function CommandMenu(){
 const dialog=useRef<HTMLDialogElement>(null);const search=useRef<HTMLInputElement>(null);const previous=useRef<HTMLElement|null>(null);const [query,setQuery]=useState('');
 const filtered=commands.filter(item=>(item.label+' '+item.hint).toLowerCase().includes(query.toLowerCase().trim()));
 function open(){if(dialog.current?.open)return;previous.current=document.activeElement as HTMLElement;setQuery('');dialog.current?.showModal();search.current?.focus();}
 function close(){dialog.current?.close();previous.current?.focus();}
 function go(id:string){close();const section=document.getElementById(id);if(!section)return;section.tabIndex=-1;section.focus({preventScroll:true});section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});history.replaceState(null,'',`#${id}`);}
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(dialog.current?.open)close();else open();}};window.addEventListener('keydown',key);return ()=>window.removeEventListener('keydown',key);},[]);
 return <><button type="button" className="command-launch" onClick={open} aria-label="Open quick navigation (Control or Command K)"><span aria-hidden="true">&#8984;</span> Explore <kbd>Ctrl / &#8984; K</kbd></button>
 <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===event.currentTarget)close();}}>
  <div className="command-panel"><div className="command-heading"><div><p>JLF / QUICK ACCESS</p><h2 id="command-title">Where to next?</h2></div><button type="button" onClick={close} aria-label="Close quick navigation">&#10005;</button></div>
  <label className="sr-only" htmlFor="command-search">Search portfolio sections</label><input ref={search} id="command-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search projects, skills, contact..." autoComplete="off" onKeyDown={event=>{if(event.key==='Enter'&&filtered[0]){event.preventDefault();go(filtered[0].id);}if(event.key==='ArrowDown'){event.preventDefault();dialog.current?.querySelector<HTMLButtonElement>('.command-result')?.focus();}}}/>
  <div className="command-results">{filtered.map(item=><button className="command-result" type="button" key={item.id} onClick={()=>go(item.id)}><span>{item.label}<small>{item.hint}</small></span><span aria-hidden="true">&#8599;</span></button>)}{!filtered.length&&<p role="status">No matching sections. Try “projects” or “contact”.</p>}</div><p className="command-help">Enter to jump · Tab to browse · Esc to close</p></div>
 </dialog></>;
}
