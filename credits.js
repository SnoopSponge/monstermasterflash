/* A slow, readable credit roll with manual scrolling and a persistent exit. */
(() => {
  const title=document.querySelector('#title'),screen=document.querySelector('#credits');
  const viewport=document.querySelector('#credits-scroll'),open=document.querySelector('#show-credits');
  const back=document.querySelector('#credits-back');
  let frame=null,previous=null,position=0,paused=false;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function stop(){if(frame!==null)window.cancelAnimationFrame(frame);frame=null;previous=null}
  function tick(now){
    frame=null;if(paused||screen.classList.contains('hidden'))return;
    if(previous!==null&&!document.hidden){
      position+=Math.min(now-previous,80)/1000*viewport.clientHeight*.026;
      viewport.scrollTop=position;
    }
    previous=now;
    if(position>=viewport.scrollHeight-viewport.clientHeight){paused=true;stop();return}
    frame=window.requestAnimationFrame(tick);
  }
  function start(){stop();position=viewport.scrollTop;if(!paused)frame=window.requestAnimationFrame(tick)}
  function manual(){paused=true;stop()}
  open.addEventListener('click',()=>{
    title.classList.add('hidden');screen.classList.remove('hidden');
    viewport.scrollTop=0;paused=reduced.matches;back.focus();start();
  });
  function close(){stop();screen.classList.add('hidden');title.classList.remove('hidden');open.focus()}
  back.addEventListener('click',close);
  viewport.addEventListener('wheel',manual,{passive:true});
  viewport.addEventListener('touchstart',manual,{passive:true});
  viewport.addEventListener('pointerdown',manual);
  screen.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close()}
    else if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)&&event.target===viewport)manual();
  });
})();
