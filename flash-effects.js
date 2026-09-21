/* Placement and lifetime of the original Flash spell timelines. */
(() => {
  const active=new Set();
  function clear(){for(const stop of [...active])stop()}
  function play(name,geometry={}){
    const game=document.querySelector('#game');if(!game||game.classList.contains('hidden'))return;
    const board=game.getBoundingClientRect();if(!board.width||!board.height)return;
    const box=r=>r?{x:board.left+r.x*board.width,y:board.top+r.y*board.height,w:r.w*board.width,h:r.h*board.height}:null;
    const target=box(geometry.target),source=box(geometry.source);
    const layer=document.createElement('div');layer.className=`flash-effect flash-${name}`;layer.setAttribute('aria-hidden','true');
    let frame=null,timeout=null,ended=false;
    const stop=()=>{if(ended)return;ended=true;if(frame!==null)cancelAnimationFrame(frame);if(timeout!==null)clearTimeout(timeout);layer.remove();active.delete(stop)};
    active.add(stop);document.body.append(layer);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const statCircle=name==='good'||name==='bad';
    const spec=window.MMFlashSprites?.[statCircle?'stat-circle':name];if(!spec){stop();return}
    let width,height,duration;
    const canvas=document.createElement('canvas');layer.append(canvas);
    if(statCircle){
      if(!target){stop();return}
      // The supplied 150px circle grows from its center for 40 Flash frames.
      // Anchor on the number itself, keeping the circular aspect ratio at every size.
      width=height=Math.max(target.h*3,target.w*1.4);duration=spec.frames*40;
      Object.assign(layer.style,{left:`${target.x+target.w/2-width/2}px`,top:`${target.y+target.h/2-height/2}px`});
    }else if(name==='lightning'||name==='fireball'){
      if(!target){stop();return}
      const end={x:target.x+target.w/2,y:target.y+target.h*.42},start=source?{x:source.x+source.w/2,y:source.y+source.h*.42}:{x:end.x,y:end.y+target.h*2};
      const dx=end.x-start.x,dy=end.y-start.y,distance=Math.max(1,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx)*180/Math.PI;
      if(name==='lightning'){
        width=Math.max(target.w*.55,distance*.15);height=distance*1.15;duration=240;
        // The original bolt's bright endpoint is native y=100: point it at the victim.
        Object.assign(layer.style,{left:`${start.x-width/2}px`,top:`${start.y}px`,transformOrigin:'50% 0',transform:`rotate(${angle-90}deg)`});
      }else{
        const scale=distance/555;width=679*scale;height=200*scale;duration=720;
        Object.assign(layer.style,{left:`${start.x-20*scale}px`,top:`${start.y-height/2}px`,transformOrigin:`${20*scale}px 50%`,transform:`rotate(${angle}deg)`});
      }
    }else if(name==='black-hole'){
      width=board.width*.24;height=width*275/249;duration=1250;
      Object.assign(layer.style,{left:`${board.left+board.width*.49-width/2}px`,top:`${board.top+board.height*.5-height/2}px`});
    }else{
      width=board.width*2.5;height=board.height*1.5;duration=700;
      Object.assign(layer.style,{left:`${board.left}px`,top:`${board.top}px`,width:`${board.width}px`,height:`${board.height}px`,overflow:'hidden'});
      Object.assign(canvas.style,{position:'absolute',left:`${-board.width*.75}px`,top:`${-board.height*.25}px`});
    }
    Object.assign(canvas.style,{width:`${width}px`,height:`${height}px`});
    // Filters run on a bounded buffer; CSS preserves the placement at any game size.
    const scale=Math.min(window.devicePixelRatio||1,900/width,700/height);
    canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    let draw;try{draw=spec.create(canvas)}catch(error){stop();console.warn('Flash effect unavailable',name,error);return}
    const began=performance.now();let last=-1;
    const tick=now=>{
      if(ended)return;if(game.classList.contains('hidden')){stop();return}
      const elapsed=now-began;if(elapsed>=duration){stop();return}
      const index=reduced?Math.floor(spec.frames/2):statCircle||name==='flood'||name==='fireball'?Math.min(spec.frames-1,Math.floor(elapsed/40)):Math.floor(elapsed/40);
      if(index!==last){try{
        draw(index);last=index;
        if(statCircle){
          const ctx=canvas.getContext('2d');ctx.save();ctx.globalCompositeOperation='source-in';
          ctx.fillStyle=name==='good'?'#ffeb00':'#d40084';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();
        }
      }catch(error){stop();console.warn('Flash effect frame failed',name,error);return}}
      if(name==='flood')canvas.style.transform=`translateX(${reduced?0:(1-elapsed/duration*2)*board.width*1.2}px)`;
      if(name==='black-hole')layer.style.opacity=String(reduced?.85:Math.min(1,elapsed/120,(duration-elapsed)/250));
      if(reduced){timeout=setTimeout(stop,220);return}
      frame=requestAnimationFrame(tick);
    };
    tick(began);
  }
  window.MMFlashEffects={play,clear};
  window.addEventListener('resize',clear);
})();
