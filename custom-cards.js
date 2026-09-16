/* Custom monsters are data, never executable scripts. Portable packs include artwork. */
(() => {
  'use strict';
  const ABILITIES={
    capture:{label:'Steal defeated monster',help:'After a lethal hit, takes the defeated enemy card into your hand at full health, ready to deploy. Does not steal monsters that survive or revive.',unit:'Cards per defeat',min:1,max:1,value:1,limit:true},
    poison:{label:'Poison on hit',help:'Adds this many poison stacks after damaging a monster.',min:1,max:10,value:1},
    lifesteal:{label:'Life steal',help:'Heals this monster by a percentage of damage dealt (rounded up).',unit:'Percent healed',min:1,max:100,value:50},
    weaken:{label:'Weaken on hit',help:'Reduces the target’s attack after dealing damage.',min:1,max:20,value:1},
    shred:{label:'Break armor',help:'Reduces the target’s defense after dealing damage.',min:1,max:20,value:1},
    freeze:{label:'Freeze on hit',help:'Prevents the target attacking for this many of its turns.',unit:'Turns',min:1,max:3,value:1},
    execute:{label:'Finishing blow',help:'After a damaging hit, defeats a target at or below this health.',unit:'Health threshold',min:1,max:50,value:2},
    ward:{label:'Ghost ward',help:'Negates this many winning enemy attack rolls per deployment.',unit:'Charges',min:1,max:5,value:1},
    regenerate:{label:'Regeneration',help:'Heals at the end of its owner’s turn, before poison damage.',min:1,max:20,value:1},
    thorns:{label:'Thorns',help:'Returns damage to a monster that dealt battle damage to it, if still alive.',min:1,max:10,value:1},
    summonBlast:{label:'Summoning blast',help:'Deals damage to every enemy monster when deployed.',min:1,max:10,value:1},
    rage:{label:'Rage',help:'Gains attack when damaged and survives. Limit sets maximum activations per deployment.',min:1,max:10,value:1,limit:true},
    revive:{label:'Second life',help:'Restores this much health after lethal damage. Limit sets uses per deployment. Cannot stop destroy effects.',unit:'Restored health',min:1,max:50,value:2,limit:true},
    draw:{label:'Draw on summon',help:'Draws this many cards when deployed. An empty deck still loses the duel.',unit:'Cards',min:1,max:3,value:1},
    deathBurst:{label:'Death burst',help:'Deals damage to each enemy monster when this monster dies.',min:1,max:10,value:1},
    split:{label:'Split on death',help:'Creates this many ready Mini Slimes after death.',unit:'Mini Slimes',min:1,max:3,value:2},
    mimic:{label:'Copy battle stats',help:'Always uses this percentage of the opponent’s relevant battle stat. Two copying monsters use their own stats.',unit:'Percent copied',min:1,max:200,value:100,always:true}
  };
  const MAX_IMAGE=3*1024*1024,MAX_PACK=24*1024*1024,MAX_CARDS=100;
  let cards=[],hooks=null,dbPromise=null,ready=Promise.resolve(),screen=null,dirty=false,importing=false;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const $=s=>document.querySelector(s);
  const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
  function int(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw Error(`${label} must be a whole number from ${min} to ${max}.`);return value}
  function text(value,max,label){if(typeof value!=='string'||value.length>max)throw Error(`${label} must be text of at most ${max} characters.`);return value.trim()}
  function imageData(value){
    if(value==='')return '';
    if(typeof value!=='string'||value.length>Math.ceil(MAX_IMAGE*4/3)+100)throw Error('Artwork must be PNG, JPEG, WebP or GIF, up to 3 MB.');
    const m=value.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/);
    if(!m)throw Error('Artwork must be an embedded PNG, JPEG, WebP or GIF image.');
    let bytes;try{bytes=atob(m[2])}catch{throw Error('Artwork contains invalid image data.')}
    const signatures={png:bytes.startsWith('\x89PNG\r\n\x1a\n'),jpeg:bytes.startsWith('\xff\xd8\xff'),gif:bytes.startsWith('GIF87a')||bytes.startsWith('GIF89a'),webp:bytes.startsWith('RIFF')&&bytes.slice(8,12)==='WEBP'};
    if(!signatures[m[1]]||bytes.length>MAX_IMAGE)throw Error('Artwork does not match its image format or is too large.');
    return value;
  }
  function validate(raw,builtins=[]){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Each card must be an object.');
    const id=text(raw.id,80,'Card ID'),name=text(raw.name,32,'Name');
    if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id))throw Error('Invalid card ID.');
    if(!name||/[<>\u0000-\u001f]/.test(name)||['prototype',...Object.getOwnPropertyNames(Object.prototype)].some(n=>n.toLowerCase()===name.toLowerCase())||builtins.some(n=>n.toLowerCase()===name.toLowerCase()))throw Error('Choose a unique name that does not replace a built-in card.');
    if(!Array.isArray(raw.abilities)||raw.abilities.length>8)throw Error('Choose up to 8 abilities per card.');
    const kinds=new Set();
    const abilities=raw.abilities.map(a=>{
      if(!a||!Object.hasOwn(ABILITIES,a.kind)||kinds.has(a.kind))throw Error('Unknown or duplicate ability.');
      kinds.add(a.kind);const def=ABILITIES[a.kind];
      if(def.always&&a.chance!==100)throw Error('Copy battle stats always uses 100% chance. Adjust Percent copied to change its power.');
      return {kind:a.kind,power:int(a.power,def.min,def.max,def.unit||'Power'),chance:int(a.chance,1,100,'Chance'),limit:int(a.limit??1,1,10,'Activation limit')};
    });
    const flags={};for(const key of ['poisonImmune','healImmune','psychicImmune','counterImmune']){if(typeof raw[key]!=='boolean')throw Error('Invalid resistance setting.');flags[key]=raw[key]}
    return {id,name,description:text(raw.description??'',180,'Description'),
      attack:int(raw.attack,0,Number.MAX_SAFE_INTEGER,'Attack'),defense:int(raw.defense,0,Number.MAX_SAFE_INTEGER,'Defense'),health:int(raw.health,1,Number.MAX_SAFE_INTEGER,'Health'),summon:int(raw.summon,0,Number.MAX_SAFE_INTEGER,'Summoning turns'),attacks:int(raw.attacks,0,Number.MAX_SAFE_INTEGER,'Attacks per turn'),
      value:int(raw.value,0,Number.MAX_SAFE_INTEGER,'Deck value'),limit:int(raw.limit,1,Number.MAX_SAFE_INTEGER,'Copy limit'),image:imageData(raw.image??''),abilities,...flags};
  }
  function validatePack(raw,builtins=[]){
    if(!raw||raw.format!=='monster-master-cards'||raw.version!==1||!Array.isArray(raw.cards)||!raw.cards.length||raw.cards.length>MAX_CARDS)throw Error('Use a Monster Master card pack (version 1, 1–100 cards).');
    const result=raw.cards.map(c=>validate(c,builtins));const ids=new Set(),names=new Set();
    for(const c of result){if(ids.has(c.id)||names.has(c.name.toLowerCase()))throw Error('The pack contains duplicate IDs or names.');ids.add(c.id);names.add(c.name.toLowerCase())}
    return result;
  }
  function abilityText(a){const d=ABILITIES[a.kind];return `${d.label}: ${a.power}${d.unit==='Percent healed'||d.unit==='Percent copied'?'%':''} (${a.chance}% chance${d.limit?`, up to ${a.limit} uses`:''}).`}
  function description(c){return [c.description,...c.abilities.map(abilityText),c.poisonImmune?'Immune to poison.':'',c.healImmune?'Cannot be healed by spells or life steal.':'',c.psychicImmune?'Immune to Psychic.':'',c.counterImmune?'No damage from failed attacks.':''].filter(Boolean).join(' ')}
  function blank(){return {id:'custom_'+crypto.randomUUID().replaceAll('-',''),name:'',description:'',attack:4,defense:3,health:4,summon:1,attacks:1,value:40,limit:3,image:'',abilities:[],poisonImmune:false,healImmune:false,psychicImmune:false,counterImmune:false}}
  function database(){
    if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(Error('Browser storage is unavailable. Export your card pack to keep it.'));return}
      const request=indexedDB.open('monster-master-custom-cards',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('collection');
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Close other game tabs and try again.'));
    });return dbPromise;
  }
  async function persist(next){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('collection','readwrite');tx.objectStore('collection').put(next,'cards');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Save interrupted.'))})}
  async function load(){const db=await database();return new Promise((resolve,reject)=>{const request=db.transaction('collection').objectStore('collection').get('cards');request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error)})}
  function download(list){
    const blob=new Blob([JSON.stringify({format:'monster-master-cards',version:1,cards:list},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');
    a.href=url;a.download='monster-master-custom-cards.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function commit(next){
    if(next.length>MAX_CARDS)throw Error('Keep at most 100 custom cards in this browser. Export a pack before removing cards.');
    const names=new Set();for(const c of next){if(names.has(c.name.toLowerCase()))throw Error('A custom card already uses that name.');names.add(c.name.toLowerCase())}
    // Keep the previous collection intact if the storage transaction fails.
    await persist(next);cards=next;hooks.register(cards);
  }
  async function importFile(file){
    await ready;if(!file)return;
    if(importing)throw Error('An import is already in progress. Please wait.');
    importing=true;
    try{
    if(file.size>MAX_PACK)throw Error('Card packs must be smaller than 24 MB.');
    let raw;try{raw=JSON.parse(await file.text())}catch{throw Error('This is not a valid JSON card pack.')}
    const incoming=validatePack(raw,hooks.builtins);
    if(incoming.some(c=>cards.some(old=>old.id===c.id||old.name.toLowerCase()===c.name.toLowerCase())))throw Error('An imported card already exists. Remove or rename the existing custom card first; no cards were changed.');
    // Decode images before committing, including images supplied inside JSON packs.
    await Promise.all(incoming.filter(c=>c.image).map(c=>decodeImage(c.image)));
    await commit([...cards,...incoming]);hooks.message(`${incoming.length} custom card(s) imported. Find them in Use Custom Deck.`);
    }finally{importing=false}
  }
  function decodeImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(img.naturalWidth>4096||img.naturalHeight>4096)reject(Error('Artwork dimensions must be at most 4096 × 4096.'));else resolve()};img.onerror=()=>reject(Error('Artwork could not be decoded.'));img.src=src})}
  async function chooseImport(){
    const input=el('input');input.type='file';input.accept='.json,application/json';input.onchange=async()=>{try{await importFile(input.files[0])}catch(e){hooks.message(e.message)}};input.click();
  }
  async function open(){
    await ready;if(screen)return;
    $('#setup').classList.add('hidden');screen=el('section');screen.className='screen card-creator';screen.setAttribute('aria-label','Custom monster creator');$('#app').append(screen);
    let draft=blank(),editing=null,imageLoading=false,saving=false;
    screen.innerHTML='<header><h1>Monster Card Creator</h1><button data-back class="metal-button">Back to Setup</button></header><div class="creator-body"><aside><h2>Your cards</h2><select data-saved size="6" aria-label="Saved custom cards"></select><div class="creator-actions"><button data-new>New</button><button data-delete>Delete</button><button data-export>Export all</button><button data-import>Import</button></div><div data-preview></div><p>Saved in this browser. Export packs to back up or share cards, including GIF artwork.</p></aside><form><fieldset><legend>Identity &amp; artwork</legend><label>Name<input name="name" maxlength="32" required></label><label>Description<textarea name="description" maxlength="180" rows="2"></textarea></label><label>Image or animated GIF<input data-image type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label><small>PNG, JPEG, WebP or GIF · up to 3 MB · max 4096 × 4096. GIF animation is preserved.</small><button type="button" data-clear-image>Use default artwork</button></fieldset><fieldset><legend>Stats &amp; deck settings</legend><div data-stats class="creator-stats"></div></fieldset><fieldset><legend>Resistances</legend><div data-flags class="creator-flags"></div></fieldset><fieldset><legend>Special abilities</legend><p>Combine up to 8 abilities. Power and chance control each effect; activation limits apply per deployment.</p><div class="ability-add"><select data-ability-picker aria-label="Ability to add"></select><button data-add type="button">Add ability</button></div><div data-abilities></div></fieldset><div class="creator-actions"><button data-save type="submit">Save monster</button><button data-export-one type="button">Export this card</button></div><p data-status role="status" aria-live="polite"></p></form></div>';
    const form=screen.querySelector('form'),status=screen.querySelector('[data-status]');
    const numeric={attack:['Attack',0],defense:['Defense',0],health:['Health',1],summon:['Summoning turns',0],attacks:['Attacks per turn',0],value:['Deck strength value',0],limit:['Normal copy limit',1]};
    for(const [key,[label,min,max]] of Object.entries(numeric)){const l=el('label',label),input=el('input');input.type='number';input.name=key;input.min=min;input.step=1;input.required=true;l.append(input);screen.querySelector('[data-stats]').append(l)}
    for(const [key,label] of Object.entries({poisonImmune:'Immune to poison',healImmune:'Immune to healing',psychicImmune:'Immune to Psychic',counterImmune:'No damage on failed attacks'})){const l=el('label'),input=el('input');input.type='checkbox';input.name=key;l.append(input,document.createTextNode(label));screen.querySelector('[data-flags]').append(l)}
    const picker=screen.querySelector('[data-ability-picker]');for(const [kind,a] of Object.entries(ABILITIES)){const option=el('option',a.label);option.value=kind;picker.append(option)}
    const saved=screen.querySelector('[data-saved]');
    function refreshList(){saved.replaceChildren();for(const c of cards){const option=el('option',c.name);option.value=c.id;saved.append(option)}saved.value=editing||'';screen.querySelector('[data-delete]').disabled=!editing;screen.querySelector('[data-export]').disabled=!cards.length}
    function read(){const c={...draft};for(const key of ['name','description'])c[key]=form.elements[key].value;for(const key of Object.keys(numeric))c[key]=Number(form.elements[key].value);for(const key of ['poisonImmune','healImmune','psychicImmune','counterImmune'])c[key]=form.elements[key].checked;return c}
    function preview(){
      const c=read(),box=screen.querySelector('[data-preview]');box.replaceChildren();
      const card=el('div');card.className='creator-preview-card';card.append(el('strong',c.name||'Your monster'));const img=el('img');img.src=c.image||'assets/m-greebler.png';img.alt='Monster artwork';card.append(img,el('span',`${c.summon} turn(s)`),el('b',`⚔ ${c.attack}  ◆ ${c.defense}  ♥ ${c.health}`));box.append(card,el('p',`${c.attacks} attack(s) per turn. ${description(c)}`));
    }
    function abilities(){
      const box=screen.querySelector('[data-abilities]');box.replaceChildren();
      for(const a of draft.abilities){const def=ABILITIES[a.kind],row=el('div');row.className='ability-row';row.append(el('strong',def.label),el('small',def.help));
        for(const [key,label,min,max] of [['power',def.unit||'Power',def.min,def.max],...(!def.always?[['chance','Chance %',1,100]]:[]),...(def.limit?[['limit','Max uses',1,10]]:[])]){const l=el('label',label),input=el('input');input.type='number';input.min=min;input.max=max;input.step=1;input.required=true;input.value=a[key];input.oninput=()=>{a[key]=Number(input.value);dirty=true;preview()};l.append(input);row.append(l)}
        const remove=el('button','Remove');remove.type='button';remove.onclick=()=>{draft.abilities=draft.abilities.filter(x=>x!==a);dirty=true;abilities();preview()};row.append(remove);box.append(row)
      }
      for(const option of picker.options)option.disabled=draft.abilities.some(a=>a.kind===option.value);
      if(picker.selectedOptions[0]?.disabled)picker.value=[...picker.options].find(o=>!o.disabled)?.value||'';
      screen.querySelector('[data-add]').disabled=draft.abilities.length>=8;
    }
    function populate(c){draft=clone(c);for(const key of ['name','description',...Object.keys(numeric)])form.elements[key].value=draft[key];for(const key of ['poisonImmune','healImmune','psychicImmune','counterImmune'])form.elements[key].checked=draft[key];abilities();preview();refreshList();dirty=false;status.textContent=''}
    function mayDiscard(){if(imageLoading||saving||importing){status.textContent='Wait for the current save, import or artwork upload to finish.';return false}return !dirty||window.confirm('Discard unsaved changes to this card?')}
    form.oninput=()=>{dirty=true;preview()};
    screen.querySelector('[data-add]').onclick=()=>{if(draft.abilities.length>=8||draft.abilities.some(a=>a.kind===picker.value))return;const a=ABILITIES[picker.value];draft.abilities.push({kind:picker.value,power:a.value,chance:100,limit:1});dirty=true;abilities();preview()};
    screen.querySelector('[data-new]').onclick=()=>{if(mayDiscard()){editing=null;populate(blank())}};
    saved.onchange=()=>{const selected=cards.find(c=>c.id===saved.value);if(selected&&mayDiscard()){editing=selected.id;populate(selected)}else saved.value=editing||''};
    screen.querySelector('[data-back]').onclick=()=>{if(mayDiscard()){screen.remove();screen=null;$('#setup').classList.remove('hidden')}};
    screen.querySelector('[data-image]').onchange=async e=>{
      const file=e.target.files[0];if(!file)return;
      if(file.size>MAX_IMAGE){status.textContent='Choose an image or GIF smaller than 3 MB.';return}
      imageLoading=true;status.textContent='Loading artwork…';
      try{const url=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Could not read artwork.'));r.readAsDataURL(file)});imageData(url);await decodeImage(url);draft.image=url;dirty=true;preview();status.textContent='Artwork loaded.'}catch(e){status.textContent=e.message}finally{imageLoading=false}
    };
    screen.querySelector('[data-clear-image]').onclick=()=>{draft.image='';dirty=true;preview()};
    form.onsubmit=async e=>{
      e.preventDefault();if(imageLoading||importing){status.textContent='Wait for artwork or card imports to finish loading.';return}
      const save=screen.querySelector('[data-save]');if(saving)return;save.disabled=true;saving=true;
      try{const c=validate(read(),hooks.builtins);const next=cards.filter(x=>x.id!==editing);next.push(c);for(const f of form.querySelectorAll('fieldset'))f.disabled=true;await commit(next);editing=c.id;populate(c);status.textContent='Saved. Open Use Custom Deck in Player Setup to add this monster. Turn off Original cards only to use custom cards.'}catch(e){status.textContent=`Not saved: ${e.message} You can export this card as a backup.`}finally{save.disabled=false;saving=false;for(const f of form.querySelectorAll('fieldset'))f.disabled=false}
    };
    screen.querySelector('[data-export-one]').onclick=()=>{try{if(imageLoading)throw Error('Wait for artwork to load.');download([validate(read(),hooks.builtins)])}catch(e){status.textContent=e.message}};
    screen.querySelector('[data-export]').onclick=()=>download(cards);
    screen.querySelector('[data-delete]').onclick=async()=>{if(!editing||!mayDiscard()||!window.confirm('Delete this custom monster? Export it first if you want a backup. Decks using it will need refilling.'))return;saving=true;try{await commit(cards.filter(c=>c.id!==editing));editing=null;populate(blank());status.textContent='Custom monster deleted.'}catch(e){status.textContent=e.message}finally{saving=false}};
    screen.querySelector('[data-import]').onclick=()=>{if(!mayDiscard())return;const input=el('input');input.type='file';input.accept='.json';input.onchange=async()=>{try{await importFile(input.files[0]);editing=null;populate(blank());status.textContent='Import complete.'}catch(e){status.textContent=e.message}};input.click()};
    populate(draft);
  }
  function init(config){hooks=config;ready=(async()=>{try{const saved=await load();if(saved.length){cards=validatePack({format:'monster-master-cards',version:1,cards:saved},hooks.builtins);hooks.register(cards)}}catch(e){hooks.message(`Custom cards could not be loaded: ${e.message}`)}})();return ready}
  window.MMCustom={init,open,chooseImport,validate,validatePack,imageData,description,ABILITIES,importFile};
})();
