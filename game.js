(() => {
  'use strict';

  const MONSTERS = {
    'Hydra':[6,5,6,3,2,'Attacks twice per turn'], 'Dragon':[8,4,6,3,1,'A devastating ancient beast'],
    'Ogre':[7,3,6,3,1,'Stuns enemy monster on hit'], 'Robot':[6,5,5,2,1,'Immune to heal, poison and psychic'],
    'Reaper':[5,4,4,2,1,"Lowers enemy's attack on hit"], 'Minotaur':[6,3,6,2,1,'A relentless labyrinth brute'],
    'Dwarf':[5,5,5,2,1,'Sturdy and battle hardened'], 'Golem':[4,6,5,2,1,'Immune to heal, poison and psychic'],
    'Knight':[6,4,4,2,1,'Steel, courage, and a sharp blade'], 'Cerberus':[4,3,4,1,2,'Attacks twice per turn'],
    'Vampire':[4,3,5,1,1,'Steals life when dealing damage'], 'Ninja':[4,1,3,1,1,'Kills any enemy he hits'],
    'Gorilla':[5,2,6,1,1,'Stuns enemy monster on hit'], 'Alien':[5,4,5,2,1,'Takes no damage from failed attacks'],
    'Archer':[4,2,4,1,1,'Takes no damage from failed attacks'], 'Spider':[4,2,4,1,1,'Poisons enemies it bites'],
    'Greebler':[4,3,3,1,1,'Small, fast, and surprisingly fierce'], 'Skeleton':[3,2,3,1,1,'Immune to heal and poison'],
    'Leprechaun':[2,1,2,0,1,'Steals defeated enemy monsters into your hand'], 'Rat':[2,1,2,0,1,'Poisons enemies it bites'],
    'Slime':[2,4,5,1,1,'Splits into two Mini Slimes when defeated'], 'Witch':[4,3,4,1,1,'Inflicts a random effect when it deals damage'],
    'Werewolf':[5,3,5,1,1,'Gains +1 attack when damaged, up to +2'], 'Ghost':[2,0,2,1,1,'Dealing or receiving a damaging battle hit curses the enemy monster: reduce attack and defense by 1.'],
    'Mimic':[3,3,3,1,1,"Copies its opponent's attack and defense in battle"], 'Kraken':[7,5,8,3,1,'Deals 1 damage to every enemy monster when summoned'],
    'Cyclops':[8,1,6,2,1,'Takes 1 damage whenever its attack fails'],
    'Dragon Rider':[12,6,7,2,1,'Upgraded Knight with overwhelming attack'], 'Death Knight':[8,5,6,2,2,"Two attacks; lowers enemy's attack"],
    'Ninja Rat':[6,3,5,1,1,'Kills any enemy it hits'],
    'Hydra Prime':[9,7,8,3,3,'Attacks three times per turn'], 'Ancient Dragon':[12,6,9,3,1,'An elder dragon of immense power'],
    'Ogre Warlord':[10,5,9,3,1,'Stuns enemy monster on hit'], 'War Machine':[9,8,8,2,1,'Immune to heal, poison and psychic'],
    'Minotaur King':[9,5,9,2,1,'A ruler of the endless labyrinth'], 'Dwarf King':[8,8,7,2,1,'Royal armor grants immense defense'],
    'Titan Golem':[7,9,8,2,1,'Immune to heal, poison and psychic'], 'Infernal Cerberus':[7,5,7,2,3,'Attacks three times per turn'],
    'Vampire Lord':[7,5,8,2,1,'Steals life when dealing damage'], 'Shadow Master':[7,3,6,2,1,'Kills any enemy he hits'],
    'Titan Ape':[8,4,9,2,1,'Stuns enemy monster on hit'], 'Alien Overlord':[8,7,8,2,1,'Takes no damage from failed attacks'],
    'Arcane Ranger':[7,5,7,2,1,'Takes no damage from failed attacks'], 'Broodmother':[7,4,7,2,1,'Poisons enemies it bites'],
    'Greebler King':[7,6,6,2,1,'Small crown, enormous ambition'], 'Bone Lord':[6,5,6,2,1,'Immune to heal and poison'],
    'Fortune Lord':[5,4,5,1,1,'Steals defeated enemy monsters into your hand'],
    'Royal Slime':[4,6,8,1,1,'Splits into two Mini Slimes when defeated'],
    'High Witch':[5,5,6,1,1,'Inflicts a random effect when it deals damage'],
    'Alpha Werewolf':[7,4,8,1,1,'Gains +1 attack when damaged, up to +2'],
    'Wraith':[5,5,4,1,1,'Dealing or receiving a damaging battle hit curses the enemy monster: reduce attack and defense by 1.'],
    'Greater Mimic':[5,5,5,1,1,"Copies its opponent's attack and defense in battle"],
    'Leviathan':[10,7,11,3,1,'Deals 1 damage to every enemy monster when summoned'],
    'Elder Cyclops':[12,3,9,2,1,'Takes 1 damage whenever its attack fails'],
    'Mini Slime':[1,1,1,0,1,'A small fragment of a defeated Slime'], 'Mystery Egg':[0,5,3,2,0,'Hatches into a random monster after two turns']
  };

  const MAGIC = {
    'Fire Sword':['upgrade','Increase attack by 4'], 'Ice Shield':['upgrade','Increase defense by 4'],
    'Sword':['upgrade','Increase attack by 2'], 'Shield':['upgrade','Increase defense by 2'],
    'Heal':['upgrade','Heal a friendly monster for 2'], 'Cleanse':['upgrade','Remove all harmful effects'],
    'Antidote':['upgrade','Remove poison'], 'Charge!':['upgrade','Gain an extra attack this turn'],
    'Summon':['upgrade','Finish summoning instantly'], 'Sacrifice':['upgrade','Sacrifice a monster to recover 5 life'],
    'Fireball':['downgrade','Deal 3 damage to an enemy monster'], 'Lightning':['downgrade','Deal 2 damage to an enemy monster'],
    'Poison':['downgrade','Deal 1 damage each turn'], 'Curse':['downgrade','Reduce attack and defense by 1'],
    'Weaken':['downgrade','Reduce attack by 3'], 'Vulnerable':['downgrade','Reduce defense by 3'],
    'Strip':['downgrade','Remove helpful effects'], 'Psychic':['downgrade','Control an enemy monster for one turn'],
    'Reinforce':['utility','Deploy one extra monster this turn'], 'Black Hole':['utility','Destroy every monster'],
    'Flood':['utility','Deal 1 damage to every monster'], 'Doom':['utility','Destroy the enemy with lowest attack'],
    'Necromancy':['utility','Summon every Skeleton from your piles'], 'Combine':['utility','Combines monsters with the same combiner symbol into a super monster'],
    'Steal':['utility',"Steal a card from your opponent's hand"], 'Forget':['utility','Opponent discards two random cards'],
    'Telescope':['utility',"Reveal your opponent's hand"], 'Barrier':['utility','Prevent attacks through your next turn'],
    'Reborn':['utility','Return your strongest fallen monster'], 'Beckon':['utility','Summon the strongest monster from your draw deck onto the board'],
    'Gift':['utility','Draw two cards'], 'Restore':['utility','Recover 2 life'],
    Upgrade:['upgrade','Transform a friendly symbol monster into its combined form'],
    'Double Hit':['upgrade','Permanently gain one additional attack each turn'], 'Berserk':['upgrade','Gain 3 attack but lose up to 2 defense'],
    'Undying':['upgrade','Survive the next lethal hit with 1 health'], 'Plague':['utility','Poison every flesh monster on the field'],
    'Freeze':['downgrade','Enemy monster cannot attack during its next turn. Takes 1 frostbite damage when it thaws.'], 'Time Warp':['downgrade','Add two summoning turns to an enemy monster'],
    'Monster Egg':['utility','Place an egg that hatches into a random monster after two turns'],
    'Lucky Charm':['upgrade','Re-roll a losing battle roll and keep the better result. Then discard the charm.'],
    Exhaustion:['downgrade','Remove one remaining attack this turn. Particularly useful against Hydra and Double Hit.'],
    'Ice Age':['downgrade','Freezes all enemy monsters. They take 1 frostbite damage when they thaw.']
  };
  const UPGRADE_FOR = {
    'The Emo':'The Eternal Emo','Emo Robot':'Emo Robot Prime',
    'Slime':'Royal Slime','Witch':'High Witch','Werewolf':'Alpha Werewolf','Ghost':'Wraith','Mimic':'Greater Mimic','Kraken':'Leviathan','Cyclops':'Elder Cyclops',
    'Hydra':'Hydra Prime','Dragon':'Ancient Dragon','Ogre':'Ogre Warlord','Robot':'War Machine','Reaper':'Grim Reaper',
    'Minotaur':'Minotaur King','Dwarf':'Dwarf King','Golem':'Titan Golem','Knight':'Royal Knight','Cerberus':'Infernal Cerberus',
    'Vampire':'Vampire Lord','Ninja':'Shadow Master','Gorilla':'Titan Ape','Alien':'Alien Overlord','Archer':'Arcane Ranger',
    'Spider':'Broodmother','Greebler':'Greebler King','Skeleton':'Bone Lord','Leprechaun':'Fortune Lord','Rat':'Plague Rat',
    'Dragon Rider':'Dragon Rider Prime','Death Knight':'Death Knight Prime','Ninja Rat':'Ninja Rat Prime'
  };
  function family(card){return ART_ALIASES[card.name]&&card.name!=='Mini Slime'&&card.name!=='Mystery Egg'?ART_ALIASES[card.name]:card.name}
  const COMBOS = [['Dragon','Knight','Dragon Rider'],['Reaper','Cerberus','Death Knight'],['Ninja','Rat','Ninja Rat'],['The Emo','Robot','Emo Robot']];
  const COMBINER_SYMBOLS={Dragon:'★',Knight:'★',Reaper:'☾',Cerberus:'☾',Ninja:'●',Rat:'●','The Emo':'🥀',Robot:'🥀'};
  function combinerBase(card){return Object.keys(COMBINER_SYMBOLS).find(n=>card.name===n||card.name===UPGRADE_FOR[n])}
  const NON_FLESH = new Set(['Royal Slime','Wraith','Robot','Emo Robot','Emo Robot Prime','Golem','Skeleton','Ghost','Slime','Mini Slime','Mystery Egg','War Machine','Titan Golem','Bone Lord']);
  const NON_SENTIENT = new Set(['Royal Slime','Robot','Emo Robot','Emo Robot Prime','Golem','Slime','Mini Slime','Mystery Egg','War Machine','Titan Golem']);
  const MONSTER_POOL = Object.keys(MONSTERS).slice(0,27);
  const MAGIC_POOL = Object.keys(MAGIC);
  const RASTER_SPECIALS = new Set(['Upgrade','Double Hit','Berserk','Undying','Plague','Freeze','Time Warp','Monster Egg']);
  const ART_ALIASES = {'Royal Slime':'Slime','High Witch':'Witch','Alpha Werewolf':'Werewolf','Wraith':'Ghost','Greater Mimic':'Mimic','Leviathan':'Kraken','Elder Cyclops':'Cyclops','Mystery Egg':'Monster Egg'};
  Object.assign(ART_ALIASES,{'The Eternal Emo':'The Emo','Emo Robot Prime':'Emo Robot','Grim Reaper':'Reaper','Royal Knight':'Knight','Plague Rat':'Rat','Dragon Rider Prime':'Dragon Rider','Death Knight Prime':'Death Knight','Ninja Rat Prime':'Ninja Rat'});
  Object.assign(MONSTERS,{
    'The Emo':[2,1,3,1,1,'25% chance to enjoy an incoming battle hit and take no damage.'],
    'The Eternal Emo':[4,3,5,1,1,'25% chance to enjoy an incoming battle hit and take no damage.'],
    'Emo Robot':[7,6,5,2,1,'25% chance to enjoy an incoming battle hit and take no damage. Immune to heal, poison and psychic.'],
    'Emo Robot Prime':[10,9,8,2,1,'25% chance to enjoy an incoming battle hit and take no damage. Immune to heal, poison and psychic.'],
    'Grim Reaper':[8,6,7,2,1,"Lowers enemy's attack on hit"],
    'Royal Knight':[9,6,7,2,1,'An elite knight with stronger armor and attack'],
    'Plague Rat':[5,3,5,0,1,'Poisons enemies it bites'],
    'Dragon Rider Prime':[16,9,11,2,1,'A fully empowered Dragon Rider'],
    'Death Knight Prime':[11,8,10,2,2,"Two attacks; lowers enemy's attack"],
    'Ninja Rat Prime':[9,5,8,1,1,'Kills any enemy it hits']
  });
  const NEW_DECK_CARDS = new Set(['Slime','Witch','Werewolf','Ghost','Mimic','Kraken','Cyclops','Upgrade','Double Hit','Berserk','Undying','Plague','Freeze','Time Warp','Monster Egg']);
  Object.assign(MONSTERS,{
    'Frost Wraith':[4,3,4,2,1,'Freezes monsters on attack. Immune to being Frozen.'],
    'Cinder Hound':[4,2,4,1,1,'Attacks monsters with fire 75% of the time. Hates the cold. Very effective against ice.'],
    Hound:[4,2,4,1,1,'Extinguished No fire powers. Hes just a good boy now.']
  });
  MONSTER_POOL.push('The Emo','Frost Wraith','Cinder Hound');NEW_DECK_CARDS.add('The Emo');
  for(const name of ['Frost Wraith','Cinder Hound','Lucky Charm','Exhaustion','Ice Age'])NEW_DECK_CARDS.add(name);
  for(const name of ['Lucky Charm','Exhaustion','Ice Age'])RASTER_SPECIALS.add(name);
  const EMO_QUOTES=['My heart was already broken.','That matches my mood.','Pain is just another verse.','Even my shadow feels misunderstood.','You call that hurt? I call it poetry.'];
  const DECK_SIZE=40;
  const online=window.MMOnline;
  let onlineTurn=0,remoteRoll=null,onlineEnded=false;
  const DECK_RULES={"Hydra": {"limit": 2, "cost": 90}, "Dragon": {"limit": 2, "cost": 80}, "Ogre": {"limit": 2, "cost": 80}, "Robot": {"limit": 2, "cost": 70}, "Ninja": {"limit": 3, "cost": 70}, "Reaper": {"limit": 3, "cost": 60}, "Knight": {"limit": 3, "cost": 60}, "Alien": {"limit": 3, "cost": 60}, "Minotaur": {"limit": 3, "cost": 50}, "Golem": {"limit": 3, "cost": 50}, "Dwarf": {"limit": 3, "cost": 50}, "Gorilla": {"limit": 3, "cost": 50}, "Cerberus": {"limit": 3, "cost": 45}, "Vampire": {"limit": 3, "cost": 40}, "Archer": {"limit": 3, "cost": 35}, "Spider": {"limit": 3, "cost": 30}, "Greebler": {"limit": 3, "cost": 30}, "Skeleton": {"limit": 3, "cost": 20}, "Leprechaun": {"limit": 3, "cost": 20}, "Rat": {"limit": 3, "cost": 15}, "Fire Sword": {"limit": 1, "cost": 70}, "Ice Shield": {"limit": 1, "cost": 70}, "Sword": {"limit": 3, "cost": 30}, "Shield": {"limit": 3, "cost": 30}, "Heal": {"limit": 3, "cost": 50}, "Cleanse": {"limit": 3, "cost": 50}, "Antidote": {"limit": 3, "cost": 20}, "Charge!": {"limit": 3, "cost": 50}, "Summon": {"limit": 3, "cost": 60}, "Sacrifice": {"limit": 3, "cost": 40}, "Fireball": {"limit": 3, "cost": 50}, "Lightning": {"limit": 3, "cost": 35}, "Poison": {"limit": 3, "cost": 40}, "Curse": {"limit": 3, "cost": 20}, "Weaken": {"limit": 3, "cost": 30}, "Vulnerable": {"limit": 3, "cost": 30}, "Strip": {"limit": 3, "cost": 30}, "Psychic": {"limit": 3, "cost": 80}, "Necromancy": {"limit": 1, "cost": 100}, "Combine": {"limit": 3, "cost": 50}, "Steal": {"limit": 3, "cost": 60}, "Reinforce": {"limit": 3, "cost": 40}, "Black Hole": {"limit": 2, "cost": 100}, "Flood": {"limit": 3, "cost": 30}, "Doom": {"limit": 3, "cost": 60}, "Forget": {"limit": 3, "cost": 70}, "Telescope": {"limit": 3, "cost": 30}, "Barrier": {"limit": 3, "cost": 30}, "Reborn": {"limit": 3, "cost": 70}, "Beckon": {"limit": 3, "cost": 70}, "Gift": {"limit": 3, "cost": 50}, "Restore": {"limit": 3, "cost": 70}};
  Object.assign(DECK_RULES,{
    'The Emo':{limit:3,cost:30},
    'Frost Wraith':{limit:2,cost:60},'Cinder Hound':{limit:2,cost:55},
    'Lucky Charm':{limit:2,cost:60},Exhaustion:{limit:3,cost:30},'Ice Age':{limit:1,cost:100},
    Slime:{limit:3,cost:35},Witch:{limit:3,cost:45},Werewolf:{limit:3,cost:55},Ghost:{limit:3,cost:30},
    Mimic:{limit:3,cost:45},Kraken:{limit:2,cost:90},Cyclops:{limit:2,cost:65},
    Upgrade:{limit:1,cost:160},'Double Hit':{limit:2,cost:70},Berserk:{limit:3,cost:45},Undying:{limit:2,cost:70},
    Plague:{limit:2,cost:65},Freeze:{limit:3,cost:45},'Time Warp':{limit:3,cost:45},'Monster Egg':{limit:2,cost:60}
  });
  const customDecks=[null,null];
  const ignoreDeckLimits=[false,false];
  const customDefinitions=new Map();
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function playableSpell(card){return !state.over&&!state.paused&&!state.animating&&card.owner===current()&&card.owner.hand.includes(card)}
  function combatProfile(a,d){return {attackMin:0,defenseMin:0,attackMax:battleAttackValue(a,d),defenseMax:battleDefenseValue(d,a)}}
  function battleDamage(a,b){return Math.abs(a-b)}
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const state = {players:[],current:0,barrier:2,selected:null,over:false,revealed:false,animating:false,paused:false,session:0,originalOnly:false,controllers:['human','computer'],avatars:[1,0],deckStrength:[2000,2000],uid:0,logs:[],suppressClick:0};
  function registerCustomCards(definitions){
    const previous=new Map([...customDefinitions.values()].map(c=>[c.id,c.name]));
    for(const name of customDefinitions.keys()){delete MONSTERS[name];delete DECK_RULES[name];NEW_DECK_CARDS.delete(name)}
    customDefinitions.clear();
    for(const c of definitions){customDefinitions.set(c.name,c);MONSTERS[c.name]=[c.attack,c.defense,c.health,c.summon,c.attacks,window.MMCustom.description(c)];DECK_RULES[c.name]={limit:c.limit,cost:c.value};NEW_DECK_CARDS.add(c.name)}
    for(let i=0;i<2;i++)if(customDecks[i]){
      const rename=new Map(definitions.map(c=>[previous.get(c.id),c.name]));
      customDecks[i]=customDecks[i].map(n=>rename.get(n)||n).filter(n=>Object.hasOwn(DECK_RULES,n));
      if(!customDecks[i].length||(!ignoreDeckLimits[i]&&customDecks[i].some(n=>customDecks[i].filter(x=>x===n).length>DECK_RULES[n].limit))){customDecks[i]=null;$(`[data-custom="${i}"]`).textContent='Use Custom Deck'}
    }
  }
  function ability(card,kind){return card.custom?.abilities.find(a=>a.kind===kind)}
  function procs(a){return a&&Math.random()*100<a.chance}
  function counterImmune(card){return card.custom?.counterImmune||['Alien','Archer','Alien Overlord','Arcane Ranger'].includes(card.name)}
  function customEvent(card,event,target=null,dealt=0,animate=true){
    if(!card.custom)return;
    for(const a of card.custom.abilities){
      const kind=a.kind;
      if(event==='summon'&&['summonBlast','draw'].includes(kind)&&procs(a)){
        if(kind==='draw')draw(card.owner,a.power);
        else state.players[1-card.owner.index].field.slice().forEach(c=>damageMonster(c,a.power,animate));
      }
      if(event==='turn'&&kind==='regenerate'&&procs(a))healMonster(card,a.power);
      if(event==='damaged'&&kind==='rage'&&card.health>0&&(card.abilityUses.rage||0)<a.limit&&procs(a)){card.abilityUses.rage=(card.abilityUses.rage||0)+1;card.attack+=a.power;log(`${card.name} gained ${a.power} attack.`)}
      if(event==='death'&&['deathBurst','split'].includes(kind)&&procs(a)){
        if(kind==='deathBurst')state.players[1-card.owner.index].field.slice().forEach(c=>damageMonster(c,a.power,animate));
        else for(let i=0;i<a.power;i++){const mini=makeCard('Mini Slime',card.owner);mini.summonLeft=0;card.owner.field.push(mini)}
      }
      if(event!=='hit'||dealt<=0)continue;
      if(kind==='lifesteal'&&card.health>0&&procs(a))healMonster(card,Math.ceil(dealt*a.power/100));
      if(!target?.owner.field.includes(target)||!['poison','weaken','shred','freeze','execute'].includes(kind)||!procs(a))continue;
      if(kind==='poison'&&target.flesh){for(let i=0;i<a.power;i++)addEffect(target,'Poison',false)}
      if(kind==='freeze')freezeMonster(target,a.power);
      if(kind==='weaken'||kind==='shred'){
        const stat=kind==='weaken'?'attack':'defense',name=kind==='weaken'?'Weaken':'Vulnerable',n=Math.min(a.power,target[stat]);target[stat]-=n;const existing=effect(target,name);if(existing)existing.value+=n;else addEffect(target,name,false,n);
      }
      if(kind==='execute'&&target.health<=a.power)damageMonster(target,target.health,animate);
    }
  }

  function slug(name, prefix,extension='svg'){ return `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}.${extension}`; }
  function makeCard(name, owner){
    const uid = ++state.uid;
    if (MONSTERS[name]) {
      const [attack,defense,health,summon,attacks,text] = MONSTERS[name];
      const custom=customDefinitions.has(name)?JSON.parse(JSON.stringify(customDefinitions.get(name))):null;
      const flesh = custom?!custom.poisonImmune:!NON_FLESH.has(name);
      return {uid,name,owner,type:'monster',attack,baseAttack:attack,defense,baseDefense:defense,health,maxHealth:health,summon,summonLeft:summon,attacks,baseAttacks:attacks,attacksLeft:attacks,text,flesh,sentient:custom?!custom.psychicImmune:!NON_SENTIENT.has(name),effects:[],werewolfBoost:0,custom,abilityUses:{}};
    }
    return {uid,name,owner,type:MAGIC[name][0],text:MAGIC[name][1]};
  }
  function resetMonster(card,alive=true){
    if(card.type!=='monster')return;
    const definition=card.custom;
    const [attack,defense,health,summon,attacks]=definition?
      [definition.attack,definition.defense,definition.health,definition.summon,definition.attacks]:MONSTERS[card.name];
    Object.assign(card,{attack,baseAttack:attack,defense,baseDefense:defense,maxHealth:health,health:alive?health:0,
      summon,summonLeft:summon,attacks,baseAttacks:attacks,attacksLeft:attacks,effects:[],werewolfBoost:0,abilityUses:{}});
    delete card.capturedBy;
  }
  function shuffle(items){
    for(let i=items.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]]; }
    return items;
  }
  function makeDeck(owner){
    const saved=customDecks[owner.index]?.filter(name=>!state.originalOnly||!NEW_DECK_CARDS.has(name));
    const names=saved?.length===DECK_SIZE?saved:fillDeck(saved||[],state.deckStrength[owner.index],ignoreDeckLimits[owner.index]);
    return shuffle(names.map(n=>makeCard(n,owner)));
  }
  function activeDeckRules(){return Object.fromEntries(Object.entries(DECK_RULES).filter(([name])=>!state.originalOnly||!NEW_DECK_CARDS.has(name)))}
  function fillDeck(initial,strength=2000,ignoreLimits=false){
    return generateDeck(initial,activeDeckRules(),strength,ignoreLimits);
  }
  function generateDeck(initial,rules,strength,ignoreLimits){
    const names=initial.filter(name=>rules[name]),keys=Object.keys(rules);
    const cost=()=>names.reduce((sum,n)=>sum+rules[n].cost,0);
    const remainingCosts=()=>{const counts={};for(const n of names)counts[n]=(counts[n]||0)+1;return keys.flatMap(n=>Array(Math.min(DECK_SIZE,ignoreLimits?DECK_SIZE:Math.max(0,rules[n].limit-(counts[n]||0)))).fill(rules[n].cost)).sort((a,b)=>a-b)};
    const slots=DECK_SIZE-names.length,pool=remainingCosts();
    if(slots<0||pool.length<slots)throw Error('Cannot fill this deck with the available cards.');
    // Preserve chosen cards, even when their costs make the preferred band impossible.
    const minimum=cost()+pool.slice(0,slots).reduce((a,b)=>a+b,0);
    const maximum=cost()+(slots?pool.slice(-slots).reduce((a,b)=>a+b,0):0);
    const low=Math.min(maximum,Math.max(minimum,strength-300));
    const high=Math.max(minimum,Math.min(maximum,strength+300));
    while(names.length<DECK_SIZE){
      const viable=keys.filter(n=>{
        if(!ignoreLimits&&names.filter(x=>x===n).length>=rules[n].limit)return false;
        names.push(n);const left=DECK_SIZE-names.length,rest=remainingCosts(),total=cost();names.pop();
        return rest.length>=left&&total+rest.slice(0,left).reduce((a,b)=>a+b,0)<=high&&total+(left?rest.slice(-left).reduce((a,b)=>a+b,0):0)>=low;
      });
      if(!viable.length)throw Error('Cannot fill this deck within the strength range. Adjust your selected cards.');
      names.push(viable[Math.floor(Math.random()*viable.length)]);
    }
    return names;
  }
  function openDeckBuilder(index,match=null){
    let draft=[...(match?.deck||(!match&&customDecks[index])||[])];
    let ignoreLimits=match?false:ignoreDeckLimits[index];
    const rules=match?Object.fromEntries(Object.entries(DECK_RULES).filter(([n])=>!customDefinitions.has(n)&&(match.rules.set!=='original'||!NEW_DECK_CARDS.has(n)))):activeDeckRules();draft=draft.filter(name=>rules[name]).slice(0,DECK_SIZE);
    const screen=document.createElement('section');screen.className='screen deck-builder';
    screen.innerHTML='<h1></h1><div class="ignore-limits"><label><input type="checkbox" data-ignore-limits> Ignore Limits</label></div><div class="deck-catalog"></div><footer><div class="deck-summary" aria-live="polite"></div><div class="deck-actions"><button data-fill>Fill</button><button data-clear>Clear</button><button data-cancel>Cancel</button><button data-save>OK</button></div></footer>';
    screen.querySelector('[data-ignore-limits]').checked=ignoreLimits;
    if(match){screen.querySelector('.ignore-limits').classList.add('hidden');screen.querySelector('[data-save]').textContent='Ready';screen.classList.add('online-deck-builder')}
    screen.querySelector('[data-ignore-limits]').onchange=e=>{ignoreLimits=e.target.checked;update()};
    screen.querySelector('h1').textContent=`${match?.name||$(`#p${index+1}-name`).value||`Player ${index+1}`}, create your deck`;
    $('#setup').classList.add('hidden');$('#setup').after(screen);
    if(match)$('#online').classList.add('hidden');
    const owner={index,field:[],hand:[],deploys:1};
    const catalog=screen.querySelector('.deck-catalog');
    for(const [name,rule] of Object.entries(rules)){
      const item=document.createElement('div');item.className='deck-choice';item.dataset.name=name;
      const card=renderCard(makeCard(name,owner),'catalog');card.tabIndex=0;card.setAttribute('aria-label',`${name}: ${MAGIC[name]?.[1]||MONSTERS[name]?.[5]}`);item.append(card);
      const details=document.createElement('div');details.className='deck-value';details.textContent=`Value: ${rule.cost}\nLimit: ${rule.limit}`;item.append(details);
      const controls=document.createElement('div');controls.className='deck-quantity';
      const minus=document.createElement('button'),count=document.createElement('output'),plus=document.createElement('button');
      minus.textContent='◀';plus.textContent='▶';minus.setAttribute('aria-label',`Remove ${name}`);plus.setAttribute('aria-label',`Add ${name}`);
      minus.onclick=()=>{const i=draft.indexOf(name);if(i>=0)draft.splice(i,1);update()};
      plus.onclick=()=>{if(draft.length<DECK_SIZE&&(ignoreLimits||draft.filter(n=>n===name).length<rule.limit))draft.push(name);update()};
      controls.append(minus,count,plus);item.append(controls);catalog.append(item);
    }
    function update(){
      for(const item of catalog.children){const n=draft.filter(n=>n===item.dataset.name).length;item.querySelector('output').textContent=n;const buttons=item.querySelectorAll('.deck-quantity button');buttons[0].disabled=n===0;buttons[1].disabled=draft.length>=DECK_SIZE||(!ignoreLimits&&n>=rules[item.dataset.name].limit)}
      const overLimit=!ignoreLimits&&draft.some(n=>draft.filter(x=>x===n).length>rules[n].limit);
      const strength=draft.reduce((sum,n)=>sum+rules[n].cost,0),overStrength=match&&strength>match.rules.strength+300;
      screen.querySelector('.deck-summary').textContent=`Cards: ${draft.length}/${DECK_SIZE}\nDeck Strength: ${strength}${match?`/${match.rules.strength+300}`:''}${overLimit?' · Reduce excess copies.':''}${overStrength?' · Reduce deck strength.':''}`;
      screen.querySelector('[data-save]').disabled=overLimit||overStrength||draft.length!==DECK_SIZE;
    }
    function close(){screen.remove();$(match?'#online':'#setup').classList.remove('hidden')}
    screen.querySelector('[data-fill]').onclick=()=>{try{draft=match?onlineDeck(owner,match.rules,null,draft).map(c=>c.name):fillDeck(draft,+$(`#strength-${index}`).value,ignoreLimits);update()}catch(e){screen.querySelector('.deck-summary').textContent=e.message}};
    screen.querySelector('[data-clear]').onclick=()=>{
      draft=[];
      if(!match){
        customDecks[index]=null;
        ignoreDeckLimits[index]=ignoreLimits;
        $(`#strength-value-${index}`).textContent=$(`#strength-${index}`).value;
      }
      update();
    };
    screen.querySelector('[data-cancel]').onclick=()=>{close();match?.cancel()};
    screen.querySelector('[data-save]').onclick=()=>{if(screen.querySelector('[data-save]').disabled)return;if(match){close();match.save([...draft]);return}ignoreDeckLimits[index]=ignoreLimits;customDecks[index]=[...draft];$(`[data-custom="${index}"]`).textContent='Use Custom Deck';$(`#strength-value-${index}`).textContent=draft.reduce((sum,n)=>sum+rules[n].cost,0);close()};
    update();
  }

  function makePlayer(index,name,controller){
    const p={index,name,controller,avatar:state.avatars[index],health:20,maxHealth:20,deck:[],hand:[],field:[],grave:[],deploys:1};
    p.deck=makeDeck(p);return p;
  }
  function draw(player,count=1){
    while(count-- > 0 && !state.over){
      const card=player.deck.pop();
      if(!card){ finishGame(1-player.index,`${player.name} ran out of cards.`); return; }
      player.hand.push(card);
    }
  }
  function log(message){ state.logs.unshift(message); state.logs=state.logs.slice(0,5); }
  function toast(message){ const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),1500); }
  let audioEnabled=true;
  function sound(id){ const a=$(id); if(audioEnabled&&a){ a.currentTime=0; a.play().catch(()=>{}); } }
  function syncMenuMusic(){const music=$('#menu-music');if(!music)return;if(audioEnabled&&$('#game').classList.contains('hidden')){music.volume=.32;music.play().catch(()=>{})}else music.pause()}
  function current(){ return state.players[state.current]; }
  function opponent(){ return state.players[1-state.current]; }
  function effect(card,name){ return card.effects?.find(e=>e.name===name); }
  function freezeImmune(card){return card.name==='Frost Wraith'}
  function freezeMonster(card,turns=1){
    if(!card?.owner.field.includes(card)||freezeImmune(card))return false;
    if(card.name==='Cinder Hound'){
      card.name='Hound';card.text=MONSTERS.Hound[5];log('Cinder Hound was extinguished and became Hound.');return true;
    }
    const frozen=effect(card,'Freeze');if(frozen){frozen.value=Math.max(frozen.value||1,turns);return false}
    card.attacksLeft=0;return addEffect(card,'Freeze',false,turns);
  }
  function addEffect(card,name,positive=false,value=0){
    if(name==='Freeze'&&freezeImmune(card))return false;
    if(name==='Freeze'&&card.name==='Cinder Hound')return freezeMonster(card,value||1);
    let e=effect(card,name);
    if(e){ e.stack++; if(name==='Poison') return true; if(name==='Reaper'){ card.attack=Math.max(0,card.attack-1); e.value++; return true; } return false; }
    card.effects.push({name,positive,value,stack:1}); return true;
  }
  function removeEffect(card,name,frostbite=true){
    const i=card.effects.findIndex(e=>e.name===name); if(i<0)return false;
    const e=card.effects[i];
    if(['Fire Sword','Sword'].includes(name))card.attack-=e.value;
    if(['Ice Shield','Shield'].includes(name))card.defense-=e.value;
    if(['Reaper','Weaken'].includes(name))card.attack+=e.value;
    if(name==='Vulnerable')card.defense+=e.value;
    if(name==='Curse'){card.attack+=e.value.attack;card.defense+=e.value.defense;}
    if(name==='Double Hit'){card.attacks=Math.max(card.baseAttacks,card.attacks-e.value);card.attacksLeft=Math.min(card.attacksLeft,card.attacks);}
    if(name==='Berserk'){card.attack-=e.value.attack;card.defense+=e.value.defense;}
    if(name==='Freeze')card.attacksLeft=card.attacks;
    card.effects.splice(i,1);
    if(name==='Freeze'&&frostbite&&card.owner.field.includes(card)){log(`${card.name} takes 1 frostbite damage as it thaws.`);damageMonster(card,1)}
    return true;
  }
  function removeEffects(card,positive){
    const list=card.effects.filter(e=>e.positive===positive).map(e=>e.name); list.forEach(n=>removeEffect(card,n)); return list.length>0;
  }
  function cardStrength(c){return (c.attack||0)*(c.attacks||1)+(c.defense||0)+(c.maxHealth||0)}
  function takeCard(card,fromPile,toPile){
    const from=card.owner[fromPile]; const i=from.indexOf(card); if(i>=0)from.splice(i,1); card.owner[toPile].push(card);
  }
  const departingCards=new Map();
  function finishDeparture(card){
    if(departingCards.delete(card.uid))render();
  }
  function animateCardToGrave(card,delay=0){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){finishDeparture(card);return;}
    const source=document.querySelector(`.card[data-uid="${card.uid}"]`);
    const target=Number.isInteger(card.capturedBy)?$(`#p${card.capturedBy+1}-hand`):$(`#p${card.owner.index+1}-grave-pile`);
    if(!source||!target){finishDeparture(card);return;}
    const start=source.getBoundingClientRect(),end=target.getBoundingClientRect();
    const ghost=source.cloneNode(true);ghost.classList.add('discard-flight');ghost.disabled=true;
    Object.assign(ghost.style,{left:`${start.left}px`,top:`${start.top}px`,width:`${start.width}px`,height:`${start.height}px`});
    document.body.append(ghost);
    ghost.animate([
      {transform:'translate(0,0)',opacity:1},
      {transform:`translate(${end.left-start.left+(end.width-start.width)/2}px,${end.top-start.top+(end.height-start.height)/2}px)`,opacity:1}
    ],{duration:380,delay,easing:'ease-in-out',fill:'forwards'}).finished.catch(()=>{}).finally(()=>{ghost.remove();finishDeparture(card)});
  }
  function animateMonsterDamage(card,amount){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const source=document.querySelector(`.field .card[data-uid="${card.uid}"]`);if(!source)return;
    const box=source.getBoundingClientRect(),ghost=source.cloneNode(true);ghost.classList.add('damage-ghost');ghost.disabled=true;
    Object.assign(ghost.style,{left:`${box.left}px`,top:`${box.top}px`,width:`${box.width}px`,height:`${box.height}px`});document.body.append(ghost);
    const filled=[...ghost.querySelectorAll('.health-pip.filled')];
    for(let i=0;i<Math.min(amount,filled.length);i++)setTimeout(()=>filled[filled.length-1-i]?.classList.remove('filled'),100+i*95);
    const number=document.createElement('b');number.className='damage-number';number.textContent=`−${amount}`;number.style.left=`${box.left+box.width/2}px`;number.style.top=`${box.top+box.height*.42}px`;document.body.append(number);
    setTimeout(()=>{ghost.remove();number.remove()},amount>=card.health?100+Math.min(amount,50)*95:620+Math.min(amount,50)*95);
  }
  function kill(card,discardDelay=0,animate=true,split=false){
    if(!card || !card.owner.field.includes(card)) return;
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)departingCards.set(card.uid,card);
    if(animate)animateCardToGrave(card,discardDelay);
    resetMonster(card,false);
    takeCard(card,'field','grave'); log(`${card.name} fell.`);
    customEvent(card,'death',null,0,animate);
    if(split&&family(card)==='Slime'){
      for(let i=0;i<2;i++){const mini=makeCard('Mini Slime',card.owner);mini.summonLeft=0;card.owner.field.push(mini)}
      log(`${card.name} split into two Mini Slimes.`);
    }
  }
  function fireDamage(card,amount,animate=true){
    if(card.name==='Cinder Hound')return 0;
    return damageMonster(card,amount,animate);
  }
  function damageMonster(card,amount,animate=true){
    if(!card||!card.owner.field.includes(card)||amount<=0||card.health<=0)return 0;
    const saved=amount>=card.health&&effect(card,'Undying');
    if(saved){amount=Math.max(0,card.health-1);removeEffect(card,'Undying');log(`${card.name} refused to fall.`)}
    const dealt=Math.min(amount,card.health);if(animate&&dealt)animateMonsterDamage(card,dealt);card.health-=dealt;
    if(dealt)log(`${card.name} took ${dealt} damage.`);
    if(dealt&&card.health>0&&family(card)==='Werewolf'&&card.werewolfBoost<2){card.attack++;card.werewolfBoost++;log(`${card.name} gained 1 attack.`)}
    if(dealt)customEvent(card,'damaged',null,dealt,animate);
    const revive=ability(card,'revive');
    if(card.health<=0&&revive&&(card.abilityUses.revive||0)<revive.limit&&procs(revive)){card.abilityUses.revive=(card.abilityUses.revive||0)+1;card.health=Math.min(card.maxHealth,revive.power);log(`${card.name} returned with ${card.health} health.`);return dealt||true}
    if(card.health<=0)kill(card,animate?100+Math.min(dealt,50)*95:0,animate,true);return dealt||!!saved;
  }
  function healMonster(card,amount){ if((card.custom?card.custom.healImmune:!card.flesh) || card.health>=card.maxHealth||card.health<=0)return false; card.health=Math.min(card.maxHealth,card.health+amount); return true; }
  function healPlayer(player,amount){ if(player.health>=player.maxHealth)return false; player.health=Math.min(player.maxHealth,player.health+amount); return true; }

  // Face colors follow the individual cards in the Flash reference.
  const CARD_TINTS = {
    Hydra:['#7776a0','#474457'],Dragon:['#85869c','#49485e'],Ogre:['#998978','#5a4c45'],
    Robot:['#8a9795','#515e5c'],Ninja:['#8d799c','#514360'],Reaper:['#969370','#50513b'],
    Knight:['#899392','#535d61'],Alien:['#7496b2','#46616f'],Minotaur:['#8c895f','#50503c'],
    Golem:['#789795','#4c6462'],Dwarf:['#7e8868','#4f5542'],Gorilla:['#858573','#4c4e3e'],
    Cerberus:['#928078','#5d4b42'],Vampire:['#7c8581','#454e4b'],Archer:['#7f959e','#4b6370'],
    Spider:['#838866','#4c523c'],Greebler:['#72958c','#436058'],Skeleton:['#8b8e84','#57594c'],
    Leprechaun:['#7c9c74','#45603e'],Rat:['#8d9270','#4d523b'],
    // Match the original muted, two-tone frames by material and creature theme.
    Slime:['#80a58c','#496953'],Witch:['#a087b2','#604b70'],Werewolf:['#ac9479','#6c5543'],
    Ghost:['#9bb8bb','#577579'],Mimic:['#b29b73','#77603f'],Kraken:['#799fa6','#3f6470'],
    'Frost Wraith':['#a6d8ed','#557fba'],'Cinder Hound':['#ce9272','#774437'],Hound:['#ad9982','#625348'],
    Cyclops:['#a9a16e','#6b653e'],'The Emo':['#95899e','#554b64'],
    'Emo Robot':['#8e93ab','#4f526d'],'Dragon Rider':['#9897b2','#555670'],
    'Death Knight':['#96869f','#5c4866'],'Ninja Rat':['#93927c','#575745'],
    'Mini Slime':['#80a58c','#496953'],'Mystery Egg':['#b0b984','#697948']
  };
  const SPELL_TINTS = {
    'Fire Sword':['#e9c080','#9d702b'],'Ice Shield':['#ead19a','#ac8142'],Sword:['#d4cb8d','#8c895d'],Shield:['#bbcad9','#758897'],
    Heal:['#ffa3a9','#e5818a'],Cleanse:['#b8c6f1','#8296d2'],Antidote:['#c8e0bc','#92b296'],
    'Charge!':['#e6c985','#ab883e'],Summon:['#90b431','#456613'],Sacrifice:['#cf2220','#840202'],
    Fireball:['#c63b74','#90204f'],Lightning:['#849dc9','#465890'],Poison:['#96b360','#526933'],
    Curse:['#9b667d','#590747'],Weaken:['#b49dad','#665568'],Vulnerable:['#ae8da9','#5a405f'],
    Strip:['#aa729e','#68405e'],Psychic:['#aaa8cc','#595578'],Reinforce:['#d69cbd','#955b82'],
    'Black Hole':['#676490','#2c2d55'],Flood:['#86c3d4','#4f8eaa'],Doom:['#b31367','#690640'],
    Necromancy:['#b388b8','#614567'],Combine:['#cfb882','#7b714d'],Steal:['#b5a1c7','#67567b'],
    Forget:['#969dc4','#545e84'],Telescope:['#bbdef0','#80b8d2'],Barrier:['#b0dbbd','#718c79'],
    Reborn:['#c9a2ab','#866773'],Beckon:['#a7c6d6','#648b9b'],Gift:['#72bbc8','#267781'],Restore:['#fff8a9','#ccc883'],
    Upgrade:['#b5d8d5','#71849f'],'Double Hit':['#fff0b0','#e2b955'],Berserk:['#ffb9ba','#f2575b'],
    Undying:['#dcc7ee','#a180bf'],Plague:['#d8ebac','#91b45f'],Freeze:['#d1e6ff','#91aaff'],
    'Time Warp':['#e0d0fa','#a38bd2'],'Monster Egg':['#dce9b8','#9cb768'],
    'Lucky Charm':['#dcecab','#8bb75c'],Exhaustion:['#c4b0ce','#796486'],'Ice Age':['#d3f3ff','#7fa9dc']
  };
  function renderCard(card,zone){
    const button=document.createElement('button');
    button.className=`card ${card.type} zone-${zone}${state.selected?.uid===card.uid?' selected':''}`;
    button.dataset.uid=card.uid; button.dataset.owner=card.owner.index; button.dataset.cardName=card.name;
    const baseArt=Object.keys(UPGRADE_FOR).find(name=>UPGRADE_FOR[name]===card.name)||family(card);
    const tint=(card.type==='monster'?CARD_TINTS[baseArt]:SPELL_TINTS[card.name]);
    if(tint){button.style.setProperty(card.type==='monster'?'--face-top':'--spell-light',tint[0]);button.style.setProperty(card.type==='monster'?'--face-bottom':'--spell-dark',tint[1]);}
    if(effect(card,'Poison'))button.classList.add('poisoned');
    if(effect(card,'Freeze'))button.classList.add('frozen');
    if(effect(card,'Stunned'))button.classList.add('stunned');
    if(card.type==='monster' && zone==='field'){
      if(card.summonLeft>0){button.classList.add('summoning');button.dataset.summon=card.summonLeft}
      else if(card.attacksLeft<1)button.classList.add('exhausted');
      else if(card.owner===current()&&!state.animating)button.classList.add('ready');
    }
    if(zone==='hand'&&card.owner===current()&&!state.animating){
      if((card.type==='monster'&&card.owner.deploys<1))button.classList.add('unavailable');
      else button.classList.add('playable');
    }
    const artName=ART_ALIASES[card.name]||card.name;
    const artPrefix=card.name==='Mystery Egg'?'c':card.type==='monster'?'m':'c';
    const pngArt=card.type==='monster'||RASTER_SPECIALS.has(card.name);
    const img=slug(artName,artPrefix,pngArt?'png':'svg');
    const effects=card.effects||[];
    const effectLabel=effects.map(e=>`${e.name}${e.stack>1?' ×'+e.stack:''}`).join(', ');
    const statTone=(value,base)=>value>base?' stat-increased':value<base?' stat-decreased':'';
    const health=card.type==='monster'?Array.from({length:Math.min(50,card.maxHealth)},(_,i)=>`<i class="health-pip${i<Math.ceil(Math.max(0,card.health)/card.maxHealth*Math.min(50,card.maxHealth))?' filled':''}"></i>`).join(''):'';
    const wait=card.type==='monster'?(zone==='field'||zone==='battle'?card.summonLeft:card.summon):0;
    const showWait=card.type==='monster'&&zone!=='battle'&&(zone!=='field'||wait>0);
    const summoningUi=card.type==='monster'&&zone==='field'&&card.summonLeft>0?`<span class="summoning-overlay"><small>Summoning…</small><b>${card.summonLeft}</b></span>`:'';
    const monsterUi=card.type==='monster'?`${showWait?`<span class="turn-badge">${wait} turn${wait===1?'':'s'}</span>`:''}<span class="monster-health" aria-label="${Math.max(0,card.health)} of ${card.maxHealth} health">${health}</span>${summoningUi}`:'';
    const frozenUi=card.type==='monster'&&effect(card,'Freeze')?'<span class="frozen-overlay" aria-label="Frozen"><img src="assets/status-frozen.png" alt=""></span>':'';
    const stats=card.type==='monster'?`<span class="stats"><i class="stat attack${statTone(card.attack,card.baseAttack)}">${family(card)==='Mimic'?'?':card.attack}</i><i class="stat defense${statTone(card.defense,card.baseDefense)}">${family(card)==='Mimic'?'?':card.defense}</i></span>`:'';
    const brief=card.custom?card.custom.description:card.text;
    button.innerHTML=`<span class="card-name">${esc(card.name)}</span>${card.type==='monster'?`<img class="card-art" src="assets/${card.custom?'m-greebler.png':img}" data-fallback="${esc(slug(baseArt,'m','png'))}" alt="">`:`<img class="card-art spell-decal" src="assets/${pngArt?img:`decals/${img}`}" alt="" aria-hidden="true">`}${monsterUi}<span class="card-text">${esc(brief)}</span>${stats}${frozenUi}`;
    if(card.type==='monster'&&card.name.length>11){
      const title=button.querySelector('.card-name');title.classList.add('fitted-name');
      title.innerHTML=`<svg viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true"><text x="0" y="14" font-size="14" textLength="100" lengthAdjust="spacingAndGlyphs">${esc(card.name)}</text></svg>`;
    }
    if(card.custom){button.querySelector('.card-art').src=card.custom.image||'assets/m-greebler.png';button.classList.add('custom-monster');if(card.maxHealth>12)button.classList.add('dense-health')}
    const combiner=combinerBase(card);
    if(combiner){button.classList.add('has-combiner');const symbol=document.createElement('span');symbol.className='combiner-symbol';if(['The Emo','Robot'].includes(combiner))symbol.classList.add('wilted-flower');symbol.textContent=COMBINER_SYMBOLS[combiner];symbol.setAttribute('aria-label',symbol.classList.contains('wilted-flower')?'Wilted black flower combiner symbol':'Combiner symbol');button.append(symbol)}
    if(ART_ALIASES[card.name]&&Object.values(UPGRADE_FOR).includes(card.name)){
      const decal=document.createElement('img');decal.className='upgrade-decal';decal.src='assets/upgrade-overlay.png';decal.alt='';button.append(decal);
    }
    const description=card.name+' — '+card.text+(effectLabel?' | '+effectLabel:'')+(card.type==='monster'?` | Attack ${family(card)==='Mimic'?'?':card.attack}, defense ${family(card)==='Mimic'?'?':card.defense}, health ${card.health}/${card.maxHealth}`:'');
    button.setAttribute('aria-label',description);
    if(zone==='grave')button.tabIndex=-1;
    if(card.type==='monster'&&zone==='field'&&effects.length)enableFieldEffects(button,card);
    enableInfoScroll(button,button.querySelector('.card-text'));
    if(zone!=='catalog'){
      button.addEventListener('click',event=>{if(card.name==='Ice Age'&&zone==='hand'&&event.detail!==0)return;cardClicked(card,zone)});
      if(card.name==='Ice Age'&&zone==='hand')button.addEventListener('dblclick',()=>cardClicked(card,zone));
      enableDrag(button,card,zone);
    }return button;
  }
  function enableInfoScroll(trigger,content,always=false){
    if(!content)return;
    let frame=null;
    const stop=()=>{if(frame!==null)window.cancelAnimationFrame(frame);frame=null;content.scrollTop=0;content.classList.remove('info-scrolling')};
    const start=()=>{
      stop();if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      content.classList.add('info-scrolling');
      const distance=content.scrollHeight-content.clientHeight;
      if(!content.clientHeight||distance<=1){content.classList.remove('info-scrolling');return}
      const began=Date.now(),speed=Math.max(5,content.clientHeight*.12),travel=distance/speed*1000;
      const tick=()=>{
        if(!trigger.isConnected){stop();return}
        const elapsed=(Date.now()-began)%(travel+3200);
        content.scrollTop=Math.min(distance,Math.max(0,(elapsed-1400)/1000*speed));
        frame=window.requestAnimationFrame(tick);
      };
      frame=window.requestAnimationFrame(tick);
    };
    trigger.addEventListener('pointerenter',start);trigger.addEventListener('focus',start);
    trigger.addEventListener('pointerleave',stop);trigger.addEventListener('blur',stop);
    if(always)window.requestAnimationFrame(start);
  }
  const visibleCards=new Set();
  const lastCardRects=new Map();
  function layoutHands(){
    for(const row of $$('.hand')){
      const cards=[...row.children];
      if(!cards.length){row.style.removeProperty('--hand-overlap');continue}
      const width=cards[0].offsetWidth;
      if(!width||!row.clientWidth)continue;
      const padding=Math.max(4,width*.08),available=Math.max(width,row.clientWidth-padding*2);
      const gap=Math.min(2,width*.03);
      const overlap=cards.length>1?Math.max(0,(cards.length*width+(cards.length-1)*gap-available)/(cards.length-1)):0;
      row.style.setProperty('--hand-gap',`${gap}px`);
      row.style.setProperty('--hand-overlap',`${overlap}px`);
      row.scrollLeft=0;
    }
  }
  function animateArrivals(){
    const present=new Set(),positions=new Map();
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const row of $$('.hand,.field')){
      row.tabIndex=0;
      for(const node of row.children){
        const uid=node.dataset.uid,key=`${row.id}:${uid}`;present.add(key);
        if(!uid)continue;
        const box=node.getBoundingClientRect();positions.set(uid,box);
        if(!visibleCards.has(key)&&!reduced){
          const deck=$(`#p${row.id.startsWith('p1')?'1':'2'}-deck`)?.closest('.pile');
          const from=lastCardRects.get(uid)||deck?.getBoundingClientRect();
          if(from){
            // A separate flight avoids clipping the card to the hand/field scroller.
            const flight=node.cloneNode(true);flight.classList.add('deal-flight');
            flight.setAttribute('aria-hidden','true');flight.tabIndex=-1;
            Object.assign(flight.style,{left:`${box.left}px`,top:`${box.top}px`,width:`${box.width}px`,height:`${box.height}px`});
            document.body.append(flight);node.style.visibility='hidden';
            flight.animate([
              {transform:`translate(${from.left-box.left}px,${from.top-box.top}px)`,opacity:.9},
              {transform:'translate(0,0)',opacity:1}
            ],{duration:300,easing:'ease-out'}).finished.catch(()=>{}).finally(()=>{flight.remove();node.style.visibility=''});
          }
        }
      }
    }
    visibleCards.clear();present.forEach(key=>visibleCards.add(key));
    lastCardRects.clear();positions.forEach((rect,uid)=>lastCardRects.set(uid,rect));
  }
  let announcementTimer;
  function announceCard(name){
    const label=$('#turn-label');clearTimeout(announcementTimer);
    label.classList.remove('announcing');label.textContent=name;
    void label.offsetWidth; // Restart the shared text/glow fade for consecutive plays.
    label.classList.add('announcing');
    announcementTimer=setTimeout(()=>{label.classList.remove('announcing');if(state.players.length)label.textContent=`${current().name}’s turn`},950);
  }
  function spellFlash(card){ announceCard(card.name); }
  let fieldEffectFrame=null,fieldEffectAnchor=null;
  function hideFieldEffects(){
    if(fieldEffectFrame!==null)window.cancelAnimationFrame(fieldEffectFrame);
    fieldEffectFrame=null;fieldEffectAnchor=null;$('#field-effect-panel')?.remove();
  }
  function enableFieldEffects(button,card){
    const show=()=>{
      if(state.animating||$('#modal').open||!button.isConnected)return;
      hideFieldEffects();fieldEffectAnchor=button;
      const panel=document.createElement('div');panel.id='field-effect-panel';panel.className='field-effect-panel';panel.setAttribute('aria-hidden','true');
      for(const e of card.effects){const label=document.createElement('span');label.className=`field-effect ${e.positive?'beneficial':'harmful'}`;label.textContent=e.name+(e.stack>1?' ×'+e.stack:'');panel.append(label)}
      document.body.append(panel);
      const position=()=>{
        if(fieldEffectAnchor!==button||!button.isConnected){hideFieldEffects();return}
        // Follow the real card throughout its hover transition; never clone the card.
        const box=button.getBoundingClientRect();
        const width=Math.min(window.innerWidth-8,box.width*(card.effects.length>1?2:1));
        Object.assign(panel.style,{width:`${width}px`,left:`${Math.max(4,Math.min(window.innerWidth-width-4,box.left+(box.width-width)/2))}px`,top:`${box.bottom+2}px`});
        fieldEffectFrame=window.requestAnimationFrame(position);
      };
      position();
    };
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')show()});
    button.addEventListener('pointerleave',hideFieldEffects);button.addEventListener('focus',show);button.addEventListener('blur',hideFieldEffects);button.addEventListener('pointerdown',hideFieldEffects);
  }
  function showBattleCards(attacker,defender){
    hideFieldEffects();
    for(const [selector,card] of [['#battle-attacker',attacker],['#battle-defender',defender]]){
      const container=$(selector);container.classList.remove('battle-unit-damaged');container.replaceChildren(renderCard(card,'battle'));
      const notes=document.createElement('div');notes.className='battle-notes';
      // Only actual abilities are listed beneath the card, rather than flavour text.
      const hasAbility=card.custom||/poison|immune|attack.*twice|attack.*three|stun|steal|takes no|lowers|kills|damage|splits|curse|copies|hatch/i.test(card.text);
      notes.innerHTML=(card.effects||[]).map(e=>`<span class="battle-effect${e.positive?' beneficial':''}">${esc(e.name)}${e.stack>1?' ×'+e.stack:''}</span>`).join('')+(hasAbility?`<p>${esc(card.custom?.description||card.text)}</p>`:'');
      container.append(notes);enableInfoScroll(notes,notes,true);
    }
  }
  function animatePlayerHit(player,amount){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rail=$(`#p${player.index+1}-avatar`),box=rail.getBoundingClientRect();
    rail.animate([{filter:'brightness(1)'},{filter:'brightness(2)',transform:'translateX(-3px)'},{filter:'brightness(1)',transform:'translateX(0)'}],{duration:330});
    const number=document.createElement('b');number.className='damage-number';number.textContent=`−${amount}`;
    Object.assign(number.style,{left:`${box.left+box.width/2}px`,top:`${box.bottom}px`});document.body.append(number);setTimeout(()=>number.remove(),650);
  }
  function render(){
    hideFieldEffects();
    const [p1,p2]=state.players;
    if(!p1)return;
    $('#p1-label').textContent=p1.name; $('#p2-label').textContent=p2.name;
    $('#p1-avatar').src=`assets/avatar-${p1.avatar}.svg`;$('#p2-avatar').src=`assets/avatar-${p2.avatar}.svg`;
    for(const p of state.players){
      $(`#p${p.index+1}-life`).textContent=p.health;
      $(`#p${p.index+1}-life`).parentElement.setAttribute('aria-label',`${p.name}: ${Math.max(0,p.health)} of ${p.maxHealth} health`);
      $(`#p${p.index+1}-life-bar`).style.width=`${Math.max(0,p.health)/p.maxHealth*100}%`;
      $(`#p${p.index+1}-deck`).textContent=p.deck.length; renderGrave(p);
      const field=$(`#p${p.index+1}-field`),remaining=new Map(p.field.map(c=>[c.uid,c]));
      const nodes=[];
      for(const old of field.children){
        const uid=+old.dataset.uid;
        if(departingCards.has(uid)){const slot=document.createElement('div');slot.className='death-slot';slot.dataset.uid=uid;nodes.push(slot)}
        else if(remaining.has(uid)){nodes.push(renderCard(remaining.get(uid),'field'));remaining.delete(uid)}
      }
      nodes.push(...[...remaining.values()].map(c=>renderCard(c,'field')));field.replaceChildren(...nodes);
    }
    const hand=$('#p1-hand'); const viewing=handVisible(p1);
    hand.replaceChildren(...(viewing?p1.hand.map(c=>renderCard(c,'hand')):p1.hand.map(c=>cardBack(c))));
    const oppHand=$('#p2-hand'); const reveal=handVisible(p2);
    oppHand.replaceChildren(...(reveal?p2.hand.map(c=>renderCard(c,'hand')):p2.hand.map(c=>cardBack(c))));
    layoutHands();animateArrivals();
    $('#opponent-target').style.top=state.current===0?'3%':'54%';$('#opponent-target').setAttribute('aria-label',`Attack ${opponent().name}`);
    if(!$('#turn-label').classList.contains('announcing'))$('#turn-label').textContent=`${current().name}’s turn`;
    $('#p1-avatar').classList.toggle('active-duelist',state.current===0);$('#p2-avatar').classList.toggle('active-duelist',state.current===1);
    updateTurnControls();
    $('#barrier').classList.toggle('hidden',state.barrier<1); $('#barrier b').textContent=state.barrier;
    $('#hint').textContent=state.selected?targetHint(state.selected):current().controller==='computer'?'The computer is thinking…':'Choose a card to play, or a ready monster to attack.';
    if(online?.active&&state.current!==online.seat)$('#hint').textContent='Waiting for your opponent…';
    $('#battle-log').replaceChildren(...state.logs.map(x=>{const p=document.createElement('p');p.textContent=x;return p}));
  }
  function handVisible(player){
    if(online?.active)return online.seat===player.index||(state.revealed&&state.current===online.seat);
    const versusComputer=state.players.some(p=>p.controller==='computer');
    return state.revealed||(player.controller!=='computer'&&(versusComputer||state.current===player.index));
  }
  function renderGrave(player){
    const pile=$(`#p${player.index+1}-grave-pile`);pile.replaceChildren();
    const arrived=player.grave.filter(c=>!departingCards.has(c.uid));
    const top=arrived[arrived.length-1];if(top){const card=renderCard(top,'grave');card.classList.add('grave-card');card.disabled=true;pile.append(card)}
    const count=document.createElement('span');count.id=`p${player.index+1}-grave`;count.textContent=arrived.length;pile.append(count);
    if(!top){const label=document.createElement('small');label.textContent='Graveyard';pile.append(label)}
  }
  function updateTurnControls(){
    $('#end-turn').disabled=state.over||state.paused||state.animating||current()?.controller==='computer'||!!(online?.active&&(online.seat!==state.current||online.waiting));
  }
  function cardBack(card){const d=document.createElement('div');d.className='card-back';d.setAttribute('aria-label','Face-down card');if(card)d.dataset.uid=card.uid;return d}
  function targetHint(card){
    if(card.owner.field.includes(card)&&card.type==='monster')return 'Choose an enemy monster, or attack the duelist if their field is empty.';
    if(card.type==='monster')return 'Deploy this monster to your field.';
    if(card.type==='upgrade')return 'Choose one of your monsters.';
    if(card.type==='downgrade')return "Choose an opponent's monster.";
    return card.text;
  }

  function enableDrag(node,card,zone){
    node.addEventListener('pointerdown',event=>{
      if(event.button!==0||state.over||state.paused||state.animating||current().controller==='computer'||card.owner!==current()||!['hand','field'].includes(zone))return;
      if(online?.active&&online.seat!==state.current)return;
      event.preventDefault();node.setPointerCapture?.(event.pointerId);
      const start={x:event.clientX,y:event.clientY};let moving=false;const ghost=$('#drag-ghost');
      const controller=new AbortController();const signal=controller.signal;
      const showDropOptions=()=>{
        if(zone==='hand'&&(card.type==='monster'||(card.type==='utility'||card.name==='Ice Age')))$(`#p${card.owner.index+1}-field`).classList.add('drop-available');
        else if(zone==='hand'&&card.type==='upgrade')$$(`#p${card.owner.index+1}-field .card`).forEach(el=>el.classList.add('drop-available'));
        else if(zone==='hand'&&card.type==='downgrade')$$(`#p${2-card.owner.index}-field .card`).forEach(el=>el.classList.add('drop-available'));
        else if(zone==='field'){ $$(`#p${2-card.owner.index}-field .card`).forEach(el=>el.classList.add('drop-available'));$('#opponent-target').classList.add('drop-available'); }
      };
      const clearDropOptions=()=>$$('.drop-available,.drag-target').forEach(el=>el.classList.remove('drop-available','drag-target'));
      const move=e=>{
        if(!moving&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<6)return;
        if(!moving){moving=true;ghost.replaceChildren(node.cloneNode(true));ghost.classList.remove('hidden');node.style.opacity='.28';showDropOptions()}
        ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;
        $$('.drag-target').forEach(el=>el.classList.remove('drag-target'));
        const below=document.elementFromPoint(e.clientX,e.clientY);const target=below?.closest('.drop-available');if(target)target.classList.add('drag-target');
      };
      const up=e=>{
        controller.abort();node.releasePointerCapture?.(event.pointerId);node.style.opacity='';ghost.classList.add('hidden');ghost.replaceChildren();clearDropOptions();
        if(!moving||e.type==='pointercancel')return;
        state.suppressClick=Date.now()+350;
        const below=document.elementFromPoint(e.clientX,e.clientY);const targetNode=below?.closest('.card');
        const targetCard=targetNode?findCard(+targetNode.dataset.uid):null;
        if(online?.active){
          if(zone==='hand'&&(card.type==='monster'||(card.type==='utility'||card.name==='Ice Age'))&&below?.closest(`#p${card.owner.index+1}-field`))online.input({kind:'play',uid:card.uid});
          else if(zone==='hand'&&targetCard)online.input({kind:'spell',uid:card.uid,target:targetCard.uid});
          else if(zone==='field'&&targetCard?.owner===opponent())online.input({kind:'battle',uid:card.uid,target:targetCard.uid});
          else if(zone==='field'&&below?.closest('.opponent-target'))online.input({kind:'attack',uid:card.uid});
          return;
        }
        if(zone==='hand'&&card.type==='monster'&&below?.closest(`#p${card.owner.index+1}-field`))deploy(card);
        else if(zone==='hand'&&(card.type==='utility'||card.name==='Ice Age')&&below?.closest(`#p${card.owner.index+1}-field`)){if(playUtility(card)){consume(card);sound('#card-sound');render()}else toast('That card has no valid effect right now.')}
        else if(zone==='hand'&&targetCard){const wanted=card.type==='upgrade'?current():opponent();if(targetCard.owner===wanted&&playTargeted(card,targetCard)){consume(card);sound('#card-sound');render()}else toast('That card cannot be used there.')}
        else if(zone==='field'&&card.owner===current()&&targetCard?.owner===opponent())battle(card,targetCard);
        else if(zone==='field'&&card.owner===current()&&below?.closest('.opponent-target')){state.selected=card;attackPlayer()}
      };
      document.addEventListener('pointermove',move,{signal});document.addEventListener('pointerup',up,{signal,once:true});document.addEventListener('pointercancel',up,{signal,once:true});
    });
  }

  async function dramaticRoll(attacker,defender,attackResult,defenseResult){
    const attack=$('#attack-roll'),defense=$('#defense-roll');
    $('#battle-result').classList.add('rolling');
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){attack.textContent=attackResult;defense.textContent=defenseResult;$('#battle-result').classList.remove('rolling');return;}
    for(const pause of [...Array(16).fill(35),65,95,140]){
      attack.textContent=(attacker.min||0)+Math.floor(Math.random()*(attacker.attack-(attacker.min||0)+1));defense.textContent=(defender.min||0)+Math.floor(Math.random()*(defender.defense-(defender.min||0)+1));
      attack.animate([{transform:'scale(.82)',opacity:.5},{transform:'scale(1)',opacity:1}],{duration:Math.min(180,pause),easing:'ease-out'});
      defense.animate([{transform:'scale(.82)',opacity:.5},{transform:'scale(1)',opacity:1}],{duration:Math.min(180,pause),easing:'ease-out'});
      await wait(pause);
    }
    for(let distance=2;distance>=0;distance--){
      attack.textContent=Math.max(attacker.min||0,attackResult-distance);defense.textContent=Math.max(defender.min||0,defenseResult-distance);
      await wait(distance===2?100:distance===1?160:260);
    }
    $('#battle-result').classList.remove('rolling');
  }
  async function animateBattleDamage(container,amount){
    const node=$(container)?.querySelector('.card');if(!node||amount<1)return;
    const unit=$(container);unit.classList.add('battle-unit-damaged');
    const number=document.createElement('b');number.className='battle-damage-number';number.textContent=`−${amount}`;node.append(number);
    const pips=[...node.querySelectorAll('.health-pip.filled')];
    for(let i=0;i<Math.min(amount,pips.length);i++){await wait(Math.min(105,800/pips.length));const pip=pips[pips.length-1-i];pip.classList.remove('filled')}
    await wait(420);
    unit.classList.remove('battle-unit-damaged');number.remove();
  }
  function animateCinderBurn(card){
    const overlay=$('#battle-overlay');
    const node=(!overlay.classList.contains('hidden')&&overlay.querySelector(`.card[data-uid="${card.uid}"]`))||document.querySelector(`.field .card[data-uid="${card.uid}"]`);
    if(!node)return;
    node.querySelector('.cinder-burn')?.remove();
    const flames=document.createElement('span');flames.className='cinder-burn';flames.setAttribute('aria-hidden','true');
    for(let i=0;i<5;i++){const flame=document.createElement('i');flame.style.setProperty('--flame-index',i);flames.append(flame)}
    node.append(flames);setTimeout(()=>flames.remove(),680);
  }
  function findCard(uid){for(const p of state.players)for(const pile of ['hand','field','deck','grave']){const c=p[pile].find(x=>x.uid===uid);if(c)return c}return null}

  function cardClicked(card,zone){
    if(online?.active&&!online.applying){online.input({kind:'click',uid:card.uid,zone});return}
    if(Date.now()<state.suppressClick || state.over || state.paused || state.animating || current().controller==='computer')return;
    if(zone==='hand'){
      if(card.owner!==current())return;
      if(card.type==='monster'){ deploy(card); return; }
      if(card.type==='utility'||card.name==='Ice Age'){ if(playUtility(card)){consume(card);sound('#card-sound');render();} else toast('That card has no valid effect right now.'); return; }
      state.selected=state.selected?.uid===card.uid?null:card; render(); return;
    }
    if(zone==='field'){
      if(state.selected && state.selected.type!=='monster'){
        const wanted=state.selected.type==='upgrade'?current():opponent();
        if(card.owner!==wanted){toast(state.selected.type==='upgrade'?'Choose a friendly monster.':'Choose an enemy monster.');return;}
        if(playTargeted(state.selected,card)){consume(state.selected);state.selected=null;sound('#card-sound');render();} else toast('That spell cannot affect this monster.');
        return;
      }
      if(card.owner===current()){
        if(effect(card,'Stunned')){toast(`${card.name} is Stunned.`);return}
        if(effect(card,'Freeze')){toast(`${card.name} is Frozen.`);return;}
        if(card.summonLeft>0){toast(`${card.name} is still summoning.`);return;}
        if(card.attacksLeft<1){toast(`${card.name} has already attacked.`);return;}
        state.selected=state.selected?.uid===card.uid?null:card; render();
      } else if(state.selected?.type==='monster') return battle(state.selected,card);
    }
  }
  function deploy(card,free=false){
    const p=card.owner;if(!free&&p.deploys<1){toast('You may deploy only one monster each turn.');return false;}
    if(!free&&(state.over||state.paused||state.animating||p!==current()||!p.hand.includes(card)))return false;
    if(!p.hand.includes(card) && !p.deck.includes(card) && !p.grave.includes(card))return false;
    for(const pile of ['hand','deck','grave']){const i=p[pile].indexOf(card);if(i>=0)p[pile].splice(i,1)}
    resetMonster(card);p.field.push(card);if(!free)p.deploys--;
    if(family(card)==='Kraken')state.players[1-p.index].field.slice().forEach(enemy=>damageMonster(enemy,1));
    customEvent(card,'summon');
    state.selected=null; log(`${p.name} summoned ${card.name}.`); sound('#card-sound');render();return true;
  }
  function fuseSymbolMonster(target){
    if(!target?.owner.field.includes(target)||!combinerBase(target))return false;
    const player=target.owner;
    const base=combinerBase(target),combo=COMBOS.find(([first,second])=>first===base||second===base);
    if(!combo)return false;
    const upgradedSymbol=target.name===UPGRADE_FOR[base],resultName=upgradedSymbol&&UPGRADE_FOR[combo[2]]?UPGRADE_FOR[combo[2]]:combo[2];
    const index=player.field.indexOf(target),healthRatio=target.health/target.maxHealth,result=makeCard(resultName,player);
    result.health=Math.max(1,Math.ceil(result.maxHealth*healthRatio));
    result.summonLeft=target.summonLeft;result.attacksLeft=Math.min(target.attacksLeft,result.attacks);
    player.field.splice(index,1,result);resetMonster(target,false);
    log(`Upgrade transformed ${target.name} into ${result.name}.`);return true;
  }
  function combineCandidates(player,name){
    const hand=player.hand.filter(card=>combinerBase(card)===name);
    const field=player.field.filter(card=>combinerBase(card)===name).sort((a,b)=>a.health-b.health||a.summonLeft-b.summonLeft);
    return [...field,...hand].slice(0,1);
  }
  function discardCombinationPart(card){
    // Fusion consumes ingredients; it is not a death or a graveyard discard.
    // Remove state first so animation callbacks cannot restore a stale field card.
    for(const pile of ['field','hand']){
      const index=card.owner[pile].indexOf(card);
      if(index>=0)card.owner[pile].splice(index,1);
    }
    departingCards.delete(card.uid);
    visibleCards.delete(card.uid);
    if(state.selected?.uid===card.uid)state.selected=null;
    removeEffects(card,true);removeEffects(card,false);
  }
  function consume(card){if(!card.owner.hand.includes(card))return;spellFlash(card);state.selected=null;const p=card.owner;animateCardToGrave(card);const i=p.hand.indexOf(card);if(i>=0)p.hand.splice(i,1);p.grave.push(card);log(`${p.name} cast ${card.name}.`)}
  function playTargeted(spell,target){
    if(!playableSpell(spell)||!target?.owner.field.includes(target)||target.owner!==(spell.type==='upgrade'?spell.owner:opponent()))return false;
    let value;
    switch(spell.name){
      case 'Fire Sword': if(effect(target,'Fire Sword'))return false;removeEffect(target,'Sword');target.attack+=4;return addEffect(target,'Fire Sword',true,4);
      case 'Ice Shield': if(effect(target,'Ice Shield'))return false;removeEffect(target,'Shield');target.defense+=4;return addEffect(target,'Ice Shield',true,4);
      case 'Sword': if(effect(target,'Sword')||effect(target,'Fire Sword'))return false;target.attack+=2;return addEffect(target,'Sword',true,2);
      case 'Shield': if(effect(target,'Shield')||effect(target,'Ice Shield'))return false;target.defense+=2;return addEffect(target,'Shield',true,2);
      case 'Heal': return healMonster(target,2);
      case 'Cleanse': return removeEffects(target,false);
      case 'Antidote': return removeEffect(target,'Poison');
      case 'Charge!': if(target.summonLeft>0)return false;target.attacksLeft++;return true;
      case 'Summon': if(target.summonLeft<1)return false;target.summonLeft=0;return true;
      case 'Sacrifice': if(spell.owner.health>=20)return false;healPlayer(spell.owner,5);kill(target);return true;
      case 'Upgrade':return fuseSymbolMonster(target);
      case 'Lucky Charm':if(effect(target,'Lucky Charm'))return false;return addEffect(target,'Lucky Charm',true);
      case 'Exhaustion':if(target.attacksLeft<=1)return false;target.attacksLeft--;return true;
      case 'Double Hit':if(effect(target,'Double Hit'))return false;target.attacks++;target.attacksLeft++;return addEffect(target,'Double Hit',true,1);
      case 'Berserk':if(effect(target,'Berserk'))return false;value={attack:3,defense:Math.min(2,target.defense)};target.attack+=value.attack;target.defense-=value.defense;return addEffect(target,'Berserk',true,value);
      case 'Undying':if(effect(target,'Undying'))return false;return addEffect(target,'Undying',true);
      case 'Fireball': if(!fireDamage(target,3))return false;sound('#hit-sound');return true;
      case 'Lightning': if(!damageMonster(target,2))return false;sound('#hit-sound');return true;
      case 'Poison': if(!target.flesh)return false;return addEffect(target,'Poison',false);
      case 'Freeze':return freezeMonster(target);
      case 'Time Warp':target.summonLeft+=2;return true;
      case 'Curse': return curseMonster(target);
      case 'Weaken': if(effect(target,'Weaken')||target.attack<1)return false;value=Math.min(3,target.attack);target.attack-=value;return addEffect(target,'Weaken',false,value);
      case 'Vulnerable': if(effect(target,'Vulnerable')||target.defense<1)return false;value=Math.min(3,target.defense);target.defense-=value;return addEffect(target,'Vulnerable',false,value);
      case 'Strip': return removeEffects(target,true);
      case 'Psychic': if(!target.sentient||target.summonLeft>0||effect(target,'Psychic'))return false;const old=target.owner;old.field.splice(old.field.indexOf(target),1);target.owner=spell.owner;spell.owner.field.push(target);addEffect(target,'Psychic',false,old);return true;
      default:return false;
    }
  }
  function playUtility(card){
    if(!playableSpell(card))return false;
    const p=card.owner,o=state.players[1-p.index];let pool,target,worked=false;
    switch(card.name){
      case 'Ice Age':return o.field.reduce((changed,monster)=>freezeMonster(monster)||changed,false);
      case 'Reinforce':if(p.deploys>=p.hand.filter(c=>c.type==='monster').length)return false;p.deploys++;return true;
      case 'Black Hole':if(!p.field.length&&!o.field.length)return false;[...p.field,...o.field].forEach(kill);return true;
      case 'Flood':if(!p.field.length&&!o.field.length)return false;[...p.field,...o.field].forEach(c=>damageMonster(c,1));return true;
      case 'Doom':if(!o.field.length)return false;target=[...o.field].sort((a,b)=>a.attack-b.attack)[0];kill(target);return true;
      case 'Steal':if(!o.hand.length)return false;target=o.hand.splice(Math.floor(Math.random()*o.hand.length),1)[0];target.owner=p;p.hand.push(target);return true;
      case 'Forget':if(!o.hand.length)return false;for(let i=0;i<2&&o.hand.length;i++){target=o.hand.splice(Math.floor(Math.random()*o.hand.length),1)[0];o.grave.push(target)}return true;
      case 'Telescope':if(!o.hand.length)return false;state.revealed=true;toast(`${o.name}'s hand revealed until your turn ends.`);return true;
      case 'Barrier':if(state.barrier>=3)return false;state.barrier=3;return true;
      case 'Gift':draw(p,2);return true;
      case 'Restore':return healPlayer(p,2);
      case 'Plague':pool=[...p.field,...o.field].filter(c=>c.flesh&&!effect(c,'Poison'));if(!pool.length)return false;pool.forEach(c=>addEffect(c,'Poison',false));return true;
      case 'Monster Egg':target=makeCard('Mystery Egg',p);p.field.push(target);log(`${p.name} placed a mysterious egg.`);return true;
      case 'Reborn':pool=p.grave.filter(c=>c.type==='monster');if(!pool.length)return false;target=pool.sort((a,b)=>cardStrength(b)-cardStrength(a))[0];p.grave.splice(p.grave.indexOf(target),1);resetMonster(target);target.owner=p;p.hand.push(target);return true;
      case 'Beckon':pool=p.deck.filter(c=>c.type==='monster');if(!pool.length)return false;target=pool.sort((a,b)=>cardStrength(b)-cardStrength(a))[0];return deploy(target,true);
      case 'Necromancy':for(const pile of ['deck','hand','grave']){for(const c of [...p[pile]])if(c.name==='Skeleton'){deploy(c,true);worked=true}}return worked;
      case 'Combine':for(const [first,second,result] of COMBOS){const parts=[...combineCandidates(p,first),...combineCandidates(p,second)];if(parts.length===2){const punched=parts.filter(c=>c.name===UPGRADE_FOR[combinerBase(c)]).length;const keepsUpgrade=punched===2||(punched===1&&Math.random()<.5);const resultName=keepsUpgrade?UPGRADE_FOR[result]:result;parts.forEach(discardCombinationPart);p.hand.push(makeCard(resultName,p));log(`${first} + ${second} combined into ${resultName}.`);return true}}return false;
      default:return false;
    }
  }
  function battleAttackValue(attacker,defender){const copy=ability(attacker,'mimic');return (family(attacker)==='Mimic'||copy)&&family(defender)!=='Mimic'&&!ability(defender,'mimic')?Math.round(defender.attack*(copy?copy.power/100:1)):attacker.attack}
  function battleDefenseValue(defender,attacker){const copy=ability(defender,'mimic');return (family(defender)==='Mimic'||copy)&&family(attacker)!=='Mimic'&&!ability(attacker,'mimic')?Math.round(attacker.defense*(copy?copy.power/100:1)):defender.defense}
  function ghostBlocksAttack(card){const ward=ability(card,'ward');if(ward&&(card.abilityUses.ward||0)<ward.power&&procs(ward)){card.abilityUses.ward=(card.abilityUses.ward||0)+1;return true}return false}
  function emoReaction(attacker,defender,attackRoll,defenseRoll){
    const card=attackRoll>defenseRoll?defender:defenseRoll>attackRoll&&!counterImmune(attacker)?attacker:null;
    return card&&['The Emo','The Eternal Emo','Emo Robot','Emo Robot Prime'].includes(card.name)&&Math.random()<0.25?{uid:card.uid,quote:EMO_QUOTES[Math.floor(Math.random()*EMO_QUOTES.length)]}:null;
  }
  async function showEmoReaction(selector,reaction){
    $('#battle-result').textContent=`“${reaction.quote}”`;
    const container=$(selector);container.classList.add('emo-reaction');
    const hearts=[];
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){await wait(1800);container.classList.remove('emo-reaction');return}
    for(let i=0;i<7;i++){const heart=document.createElement('span');heart.className='emo-heart';heart.textContent='♥';heart.setAttribute('aria-hidden','true');heart.style.setProperty('--heart-x',`${(i-3)*15}px`);heart.style.setProperty('--heart-delay',`${i*90}ms`);container.append(heart);hearts.push(heart)}
    await wait(1800);hearts.forEach(heart=>heart.remove());container.classList.remove('emo-reaction');
  }
  function luckyBattleRolls(attacker,defender,profile,attackRoll,defenseRoll){
    const messages=[],steps=[],initialAttackRoll=attackRoll,initialDefenseRoll=defenseRoll;
    // A changed winner may trigger the other monster's charm, once each.
    for(let i=0;i<2;i++){
      const losing=attackRoll<defenseRoll?attacker:defenseRoll<attackRoll?defender:null;
      if(!losing||!effect(losing,'Lucky Charm'))break;
      const attacking=losing===attacker,min=attacking?profile.attackMin:profile.defenseMin,max=attacking?profile.attackMax:profile.defenseMax;
      const before=attacking?attackRoll:defenseRoll,reroll=min+Math.floor(Math.random()*(max-min+1)),kept=Math.max(before,reroll);
      removeEffect(losing,'Lucky Charm');
      if(attacking)attackRoll=kept;else defenseRoll=kept;
      const message=`${losing.name}'s Lucky Charm: ${before} → ${reroll}; kept ${kept}.`;
      steps.push({side:attacking?'attack':'defense',before,reroll,kept,min,max});
      messages.push(message);log(message);
    }
    return {attackRoll,defenseRoll,messages,steps,initialAttackRoll,initialDefenseRoll};
  }
  async function showBattleRollSequence(attackPower,defensePower,rolls,session=state.session){
    $('#attack-roll').classList.remove('lucky-result');$('#defense-roll').classList.remove('lucky-result');
    $$('.lucky-roll-label').forEach(node=>node.remove());
    await dramaticRoll({attack:attackPower},{defense:defensePower},rolls.initialAttackRoll,rolls.initialDefenseRoll);
    if(session!==state.session)return;
    for(const step of rolls.steps){
      await wait(550);if(session!==state.session)return;
      const die=$(`#${step.side}-roll`),label=document.createElement('span');
      label.className='lucky-roll-label';label.textContent='Lucky charm';die.parentElement.append(label);
      $('#battle-result').textContent='Lucky Charm activates';
      await wait(950);label.remove();if(session!==state.session)return;
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      for(let i=0;i<(reduced?1:14);i++){
        die.textContent=reduced?step.reroll:step.min+Math.floor(Math.random()*(step.max-step.min+1));
        await wait(reduced?180:45+i*5);if(session!==state.session)return;
      }
      die.textContent=step.reroll;await wait(500);if(session!==state.session)return;
      die.textContent=step.kept;die.classList.add('lucky-result');
      $('#battle-result').textContent=`Lucky Charm keeps ${step.kept}`;
      await wait(650);if(session!==state.session)return;
    }
  }
  async function battle(attacker,defender){
    if(state.over||state.paused)return false;
    if(state.barrier>0){toast('The barrier prevents attacks.');return false}
    if(!attacker.owner.field.includes(attacker)||!defender.owner.field.includes(defender)||state.animating||attacker.owner!==current()||defender.owner!==opponent()||attacker.summonLeft>0||attacker.attacksLeft<1||effect(attacker,'Freeze')||effect(attacker,'Stunned'))return false;
    document.querySelectorAll('.damage-ghost,.damage-number,.discard-flight,.spell-flash').forEach(node=>node.remove());
    const boardBefore=state.players.flatMap(p=>p.field.map(card=>({card,health:card.health})));
    state.animating=true;attacker.attacksLeft--;state.selected=null;render();
    const overlay=$('#battle-overlay'),panel=overlay.querySelector('.battle-panel');
    const session=state.session,profile=combatProfile(attacker,defender);
    const attackPower=profile.attackMax,defensePower=profile.defenseMax;

    showBattleCards({...attacker,attack:attackPower},{...defender,defense:defensePower});
    $('#battle-result').textContent='Rolling…';panel.classList.remove('hit','block');overlay.classList.remove('hidden');
    const rolls=luckyBattleRolls(attacker,defender,profile,profile.attackMin+Math.floor(Math.random()*(attackPower-profile.attackMin+1)),profile.defenseMin+Math.floor(Math.random()*(defensePower-profile.defenseMin+1)));
    const {attackRoll,defenseRoll}=rolls;
    const reaction=emoReaction(attacker,defender,attackRoll,defenseRoll);
    if(online?.active&&online.host)online.battle({attacker:networkCard(attacker),defender:networkCard(defender),attackPower,defensePower,attackRoll,defenseRoll,reaction,initialAttackRoll:rolls.initialAttackRoll,initialDefenseRoll:rolls.initialDefenseRoll,charmSteps:rolls.steps});
    await showBattleRollSequence(attackPower,defensePower,rolls,session);
    if(session!==state.session)return false;
    $('#attack-roll').textContent=attackRoll;$('#defense-roll').textContent=defenseRoll;
    let line=`${attacker.name} rolled ${attackRoll} vs ${defender.name} ${defenseRoll}.`;
    let damaged=null,healthBefore=0;
    if(reaction){panel.classList.add('block');await showEmoReaction(reaction.uid===attacker.uid?'#battle-attacker':'#battle-defender',reaction);line+=` “${reaction.quote}” No damage.`}
    else if(attackRoll>defenseRoll&&ghostBlocksAttack(defender)){$('#battle-result').textContent=`${defender.name}'s ward blocks the attack`;panel.classList.add('block');line+=' Ward negated the attack.';await wait(650)}
    else if(attackRoll>defenseRoll){const dmg=battleDamage(attackRoll,defenseRoll);damaged=defender;healthBefore=defender.health;$('#battle-result').textContent=`${defender.name} takes ${dmg} damage`;panel.classList.add('hit');await wait(220);damageMonster(defender,dmg,false);onHit(attacker,defender,dmg,false);await animateBattleDamage('#battle-defender',Math.max(0,healthBefore-defender.health));line+=` ${dmg} damage!`;sound('#hit-sound')}
    else if(defenseRoll>attackRoll&&!counterImmune(attacker)){const dmg=battleDamage(defenseRoll,attackRoll);damaged=attacker;healthBefore=attacker.health;$('#battle-result').textContent=`${attacker.name} takes ${dmg}${family(attacker)==='Cyclops'?' + 1 recoil':''} damage`;panel.classList.add('block');await wait(220);damageMonster(attacker,dmg,false);onHit(defender,attacker,dmg,false);if(attacker.owner.field.includes(attacker)&&family(attacker)==='Cyclops')damageMonster(attacker,1,false);await animateBattleDamage('#battle-attacker',Math.max(0,healthBefore-attacker.health));line+=` ${attacker.name} takes ${Math.max(0,healthBefore-attacker.health)}.`;sound('#hit-sound')}
    else if(family(attacker)==='Cyclops'){damaged=attacker;healthBefore=attacker.health;$('#battle-result').textContent='Cyclops takes 1 recoil damage';panel.classList.add('block');await wait(220);damageMonster(attacker,1,false);await animateBattleDamage('#battle-attacker',Math.max(0,healthBefore-attacker.health));line+=' Cyclops takes 1 recoil damage.';sound('#hit-sound')}
    else{$('#battle-result').textContent='No damage';panel.classList.add('block');line+=' No damage.';await wait(650)}
    for(const {card,health} of boardBefore.filter(x=>x.card===attacker||x.card===defender))if(card!==damaged&&health>card.health){await animateBattleDamage(card===attacker?'#battle-attacker':'#battle-defender',health-card.health);line+=` ${card.name} also took ${health-card.health} ability damage.`}
    await wait(340);if(session!==state.session)return false;overlay.classList.add('hidden');
    for(const {card,health} of boardBefore){const total=Math.max(0,health-card.health);if(total)animateMonsterDamage(card,total);if(!card.owner.field.includes(card))animateCardToGrave(card,100+Math.min(total,50)*95)}
    log(line);state.animating=false;render();return true;
  }
  function witchHex(target){
    const hexes=[];
    if(target.flesh&&!effect(target,'Poison'))hexes.push(()=>addEffect(target,'Poison',false));
    if(target.attack>0&&!effect(target,'Weaken'))hexes.push(()=>{target.attack--;return addEffect(target,'Weaken',false,1)});
    if(target.defense>0&&!effect(target,'Vulnerable'))hexes.push(()=>{target.defense--;return addEffect(target,'Vulnerable',false,1)});
    if(!freezeImmune(target)&&!effect(target,'Freeze'))hexes.push(()=>freezeMonster(target));
    if(!hexes.length)return false;hexes[Math.floor(Math.random()*hexes.length)]();log(`${target.name} was hexed by the Witch.`);return true;
  }
  function curseMonster(target){
    if(!target?.owner.field.includes(target)||effect(target,'Curse')||(target.attack<1&&target.defense<1))return false;
    const value={attack:Math.min(1,target.attack),defense:Math.min(1,target.defense)};
    target.attack-=value.attack;target.defense-=value.defense;
    return addEffect(target,'Curse',false,value);
  }
  function onHit(attacker,target,damage,animate=true){
    if(damage>0){
      const cursed=[];
      if(target&&target.owner!==attacker.owner&&family(attacker)==='Ghost')cursed.push(target);
      for(const victim of new Set(cursed))if(curseMonster(victim))log(`${victim.name} is cursed: -1 attack and defense.`);
    }
    customEvent(attacker,'hit',target,damage,animate);
    const thorns=target&&ability(target,'thorns');
    if(damage>0&&thorns&&target.owner.field.includes(target)&&attacker.owner.field.includes(attacker)&&procs(thorns))damageMonster(attacker,thorns.power,animate);
    if(!target)return;
    if(damage>0&&target.owner.field.includes(target)){
      if(attacker.name==='Frost Wraith')freezeMonster(target);
      if(attacker.name==='Cinder Hound'){
        if(target.name==='Frost Wraith'){log('Cinder Hound melts Frost Wraith.');fireDamage(target,target.health,animate)}
        else if(target.name!=='Cinder Hound'&&Math.random()<.75){removeEffect(target,'Freeze',false);log(`${target.name} burns for 1 extra damage.`);target.cinderBurns=(target.cinderBurns||0)+1;animateCinderBurn(target);fireDamage(target,1,animate)}
      }
    }
    if(!target.owner.field.includes(target)){captureDefeated(attacker,target,damage);return}
    if(['Ogre','Gorilla','Ogre Warlord','Titan Ape'].includes(attacker.name)){target.attacksLeft=0;if(!effect(target,'Stunned'))addEffect(target,'Stunned',false)}
    if(['Reaper','Death Knight'].includes(family(attacker))){if(effect(target,'Reaper'))addEffect(target,'Reaper',false,1);else{target.attack=Math.max(0,target.attack-1);addEffect(target,'Reaper',false,1)}}
    if(['Spider','Rat','Broodmother'].includes(family(attacker))&&target.flesh)addEffect(target,'Poison',false);
    if(['Ninja','Ninja Rat','Shadow Master'].includes(family(attacker))&&target.owner.field.includes(target))damageMonster(target,target.health,animate);
    if(['Vampire','Vampire Lord'].includes(attacker.name))healMonster(attacker,damage);
    if(family(attacker)==='Witch'&&target.owner.field.includes(target))witchHex(target);
    if(damage>0&&target.health>0&&target.owner.field.includes(target)&&target.owner!==attacker.owner&&family(target)==='Ghost'&&curseMonster(attacker))log(`${attacker.name} is cursed: -1 attack and defense.`);
    captureDefeated(attacker,target,damage);
  }
  function captureDefeated(attacker,target,damage){
    if(damage<=0||target.health>0||target.owner===attacker.owner||!target.owner.grave.includes(target))return false;
    const capture=ability(attacker,'capture');
    const innate=['Leprechaun','Fortune Lord'].includes(attacker.name);
    if(!innate&&(!capture||(attacker.abilityUses.capture||0)>=capture.limit||!procs(capture)))return false;
    target.owner.grave.splice(target.owner.grave.indexOf(target),1);
    target.capturedBy=attacker.owner.index;
    attacker.owner.hand.push(makeCard(target.name,attacker.owner));
    if(!innate)attacker.abilityUses.capture=(attacker.abilityUses.capture||0)+1;
    log(`${attacker.name} captured ${target.name} for ${attacker.owner.name}'s hand.`);
    return true;
  }
  function attackPlayer(){
    if(online?.active&&!online.applying){online.input({kind:'attack',uid:state.selected?.uid});return}
    if(state.over||state.paused||state.animating||current().controller==='computer'||state.selected?.type!=='monster')return;
    if(state.barrier>0){toast('The barrier prevents attacks.');return}
    if(opponent().field.length){toast('Defeat the enemy monsters first.');return}
    const a=state.selected;if(a.owner!==current()||a.summonLeft>0||a.attacksLeft<1||effect(a,'Freeze')||effect(a,'Stunned'))return;
    a.attacksLeft--;opponent().health-=a.attack;animatePlayerHit(opponent(),a.attack);onHit(a,null,a.attack);log(`${a.name} struck ${opponent().name} for ${a.attack}.`);sound('#hit-sound');state.selected=null;
    if(opponent().health<=0)finishGame(current().index,`${opponent().name} was defeated.`);render();
  }
  function endTurn(){
    if(online?.active&&!online.applying){online.input({kind:'end'});return}
    if(state.over||state.paused||state.animating||current().controller==='computer')return;
    completeTurn(current());
  }
  function completeTurn(p){
    if(online?.active)onlineTurn++;
    state.selected=null;state.revealed=false;
    for(const card of [...p.field]){
      if(!p.field.includes(card))continue;
      customEvent(card,'turn');
      if(card.summonLeft>0)card.summonLeft--;
      if(card.name==='Mystery Egg'&&card.summonLeft<1){
        const index=p.field.indexOf(card),hatched=makeCard(MONSTER_POOL[Math.floor(Math.random()*MONSTER_POOL.length)],p);
        hatched.summonLeft=0;hatched.attacksLeft=0;p.field.splice(index,1,hatched);log(`${p.name}'s Monster Egg hatched into ${hatched.name}!`);continue;
      }
      const poison=effect(card,'Poison');if(poison)damageMonster(card,poison.stack);
      if(!p.field.includes(card))continue;
      const psychic=effect(card,'Psychic');if(psychic&&card.owner===p){p.field.splice(p.field.indexOf(card),1);removeEffect(card,'Psychic');card.owner=psychic.value;psychic.value.field.push(card)}
      if(effect(card,'Stunned'))removeEffect(card,'Stunned');
      const frozen=effect(card,'Freeze');if(frozen){frozen.value=(frozen.value||1)-1;if(frozen.value<=0)removeEffect(card,'Freeze')}
      card.attacksLeft=effect(card,'Freeze')?0:card.attacks;
    }
    if(state.barrier>0)state.barrier--;
    state.current=1-state.current; startTurn();
  }
  function startTurn(){
    const p=current();
    p.deploys=1;draw(p,1);log(`${p.name}'s turn.`);render();
    if(state.over)return;
    if(p.controller==='computer'){const session=state.session;setTimeout(()=>{if(session===state.session)aiTurn()},650)}
    else if(!online?.active)showPassModal(p);
  }
  async function aiTurn(){
    const session=state.session,p=current(),o=opponent();if(state.over||state.animating||p.controller!=='computer'||!await waitUntilResumed(session))return;
    const pace=async()=>{render();await wait(480);return waitUntilResumed(session)};
    const utilities=[...p.hand].filter(c=>c.type==='utility'||c.name==='Ice Age');
    for(const c of utilities){if(playUtility(c)){consume(c);break}}
    if(!await pace())return;
    const monster=[...p.hand].filter(c=>c.type==='monster').sort((a,b)=>cardStrength(b)-cardStrength(a))[0];if(monster&&p.deploys>0)deploy(monster);
    if(!await pace())return;
    for(const spell of [...p.hand].filter(c=>c.type==='upgrade')){const t=[...p.field].sort((a,b)=>cardStrength(b)-cardStrength(a)).find(t=>playTargeted(spell,t));if(t){consume(spell);break}}
    if(!await pace())return;
    for(const spell of [...p.hand].filter(c=>c.type==='downgrade')){const t=[...o.field].sort((a,b)=>cardStrength(b)-cardStrength(a)).find(t=>playTargeted(spell,t));if(t){consume(spell);break}}
    render();await wait(520);
    if(!await waitUntilResumed(session))return;
    if(state.barrier<1){for(const a of [...p.field]){while(p.field.includes(a)&&a.summonLeft<1&&a.attacksLeft>0&&!effect(a,'Freeze')&&!effect(a,'Stunned')&&!state.over){if(!await waitUntilResumed(session))return;if(o.field.length){const target=[...o.field].sort((x,y)=>cardStrength(y)-cardStrength(x))[0];await battle(a,target)}else{a.attacksLeft--;o.health-=a.attack;animatePlayerHit(o,a.attack);sound('#hit-sound');onHit(a,null,a.attack);log(`${a.name} struck ${o.name} for ${a.attack}.`);if(o.health<=0){finishGame(p.index,`${o.name} was defeated.`);break}}if(session!==state.session)return;render();await wait(350)}}}
    if(await waitUntilResumed(session))completeTurn(p);
  }
  async function waitUntilResumed(session){while(state.paused&&session===state.session&&!state.over)await wait(100);return session===state.session&&!state.over}
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  function finishGame(winner,reason){
    state.over=true;state.onlineWinner=winner;state.onlineReason=reason;render();
    const actions=online?.active?'<button data-close>View board</button><button data-restart>New duel</button>':'<button data-replay>Restart</button><button data-restart>Change Players</button><button data-close>View board</button>';
    showModal(`<h2>${esc(state.players[winner].name)} wins!</h2><p>${esc(reason)}</p><div class="actions">${actions}</div>`,'result-dialog');
    const replay=$('[data-replay]');if(replay)replay.onclick=begin;
  }
  function showPassModal(p){
    showModal(`<h2>${esc(p.name)}’s turn</h2><div class="actions"><button class="primary" data-close autofocus>Ready</button></div>`,'turn-dialog');
    updateTurnControls();
  }
  function showRules(){showModal('<h2>How to play</h2><p>Draw one card each turn. Deploy one monster and freely play special cards. Attack and defense roll from zero to their stat; the higher roll wins and the difference is damage. Summoning and stunned monsters can be attacked. Clear the enemy field to strike the opposing player.</p><div class="actions"><button data-close>Got it</button></div>')}
  function leaveDuel(screen='title'){
    if(online?.active){online.cancel();screen='title'}
    hideFieldEffects();
    state.session++;state.over=true;state.paused=false;state.animating=false;state.selected=null;
    departingCards.clear();visibleCards.clear();lastCardRects.clear();
    $$('.damage-ghost,.damage-number,.discard-flight,.spell-flash,.deal-flight,#field-effect-panel').forEach(node=>node.remove());
    $('#battle-overlay').classList.add('hidden');$('#drag-ghost').classList.add('hidden');
    for(const id of ['game','setup','title'])$(`#${id}`).classList.toggle('hidden',id!==screen);
    if($('#modal').open)$('#modal').close();
  }
  function showModal(html,kind=''){state.paused=true;hideFieldEffects();$('#modal-content').innerHTML=html;const d=$('#modal');d.className=kind;if(!d.open)d.showModal();$$('[data-close]').forEach(b=>b.onclick=()=>d.close());const r=$('[data-restart]');if(r)r.onclick=()=>leaveDuel('setup');const m=$('[data-main-menu]');if(m)m.onclick=()=>showModal('<h2>Return to Main Menu?</h2><p>This ends the current duel.</p><div class="actions"><button data-close>Keep playing</button><button data-confirm-menu>Main Menu</button></div>');const confirm=$('[data-confirm-menu]');if(confirm)confirm.onclick=()=>leaveDuel()}
  function openMenu(){if(state.animating){toast('Finish this battle before opening the menu.');return}if(online?.active){showModal('<h2>Online match</h2><p>Online matches keep running while this menu is open.</p><div class="actions"><button data-close>Resume</button><button data-surrender>Surrender</button><button data-leave-online>Leave Match</button></div>');state.paused=false;$('[data-surrender]').onclick=()=>{$('#modal').close();online.surrender()};$('[data-leave-online]').onclick=()=>leaveDuel();return}showModal(`<h2>Game paused</h2><div class="actions"><button data-rules>Rules</button><button data-close>Resume</button><button data-restart>New duel</button><button data-main-menu>Main Menu</button></div>`);const b=$('[data-rules]');if(b)b.onclick=showRules}
  function syncControllerName(i){const input=$(`#p${i+1}-name`);input.disabled=state.controllers[i]==='computer';if(input.disabled)input.value='Computer';else if(input.value==='Computer')input.value=`Player ${i+1}`}
  function openingHand(p){draw(p,5)}
  function begin(){
    online?.clearStatus();
    if($('#modal').open)$('#modal').close();
    clearTimeout(announcementTimer);$('#turn-label').classList.remove('announcing');
    state.session++;state.paused=false;state.over=false;departingCards.clear();visibleCards.clear();lastCardRects.clear();
    state.controllers.forEach((_,i)=>syncControllerName(i));
    const names=state.controllers.map((controller,i)=>controller==='computer'?'Computer':$(`#p${i+1}-name`).value.trim()||`Player ${i+1}`);
    state.originalOnly=$('#original-only').checked;
    state.deckStrength=[+$('#strength-0').value,+$('#strength-1').value];
    state.players=[makePlayer(0,names[0],state.controllers[0]),makePlayer(1,names[1],state.controllers[1])];state.current=0;state.barrier=2;state.selected=null;state.over=false;state.revealed=false;state.animating=false;state.logs=[];
    state.players.forEach(openingHand);$('#setup').classList.add('hidden');$('#game').classList.remove('hidden');log('A two-turn barrier protects both duelists.');startTurn();
  }

  function networkCard(card){return JSON.parse(JSON.stringify(card,(key,value)=>state.players.includes(value)?{$player:value.index}:value))}
  function networkSnapshot(seat){
    return {current:state.current,barrier:state.barrier,over:state.over,animating:state.animating,revealed:state.revealed&&state.current===seat,logs:[...state.logs],selected:state.current===seat?state.selected?.uid:null,onlineWinner:state.onlineWinner,onlineReason:state.onlineReason,
      players:state.players.map(p=>({index:p.index,name:p.name,controller:'human',avatar:p.avatar,health:p.health,maxHealth:p.maxHealth,deploys:p.deploys,
        deck:Array.from({length:p.deck.length},(_,i)=>({uid:-1000-p.index*10000-i,hidden:true})),
        hand:p.index===seat||(state.revealed&&state.current===seat)?p.hand.map(networkCard):p.hand.map(c=>({uid:c.uid,hidden:true})),field:p.field.map(networkCard),grave:p.grave.map(networkCard)}))};
  }
  function validateOnlineDeck(deck,rules){
    if(deck===null)return;
    if(!Array.isArray(deck)||deck.length!==40)throw Error('Choose exactly 40 cards before pressing Ready.');
    for(const name of deck){if(typeof name!=='string'||!Object.hasOwn(DECK_RULES,name)||customDefinitions.has(name)||(rules.set==='original'&&NEW_DECK_CARDS.has(name)))throw Error('Your selected deck contains cards outside this online card set.');if(rules.limits==='normal'&&deck.filter(n=>n===name).length>DECK_RULES[name].limit)throw Error('Your deck exceeds a copy limit. Remove excess copies before pressing Ready.')}
    if(deck.reduce((sum,name)=>sum+DECK_RULES[name].cost,0)>rules.strength+300)throw Error('Your deck exceeds the selected strength range. Edit it or choose a higher strength.');
  }
  function onlineDeck(p,rules,selected,initial=[]){
    validateOnlineDeck(selected,rules);if(selected)return shuffle(selected.map(n=>makeCard(n,p)));
    const names=Object.keys(DECK_RULES).filter(n=>!customDefinitions.has(n)&&(rules.set!=='original'||!NEW_DECK_CARDS.has(n)));
    const draft=generateDeck(initial,Object.fromEntries(names.map(n=>[n,DECK_RULES[n]])),rules.strength,rules.limits==='ignore');
    validateOnlineDeck(draft,rules);
    return shuffle(draft.map(n=>makeCard(n,p)));
  }
  function reviveNetwork(value,players){
    if(Array.isArray(value))return value.map(v=>reviveNetwork(v,players));
    if(value&&typeof value==='object'){if(Object.hasOwn(value,'$player'))return players[value.$player];return Object.fromEntries(Object.entries(value).filter(([k])=>!['__proto__','constructor','prototype'].includes(k)).map(([k,v])=>[k,reviveNetwork(v,players)]))}
    return value;
  }
  function installNetworkState(data){
    if(!data||!Array.isArray(data.players)||data.players.length!==2||![0,1].includes(data.current))throw Error('Invalid match state.');
    if(!Array.isArray(data.logs)||data.logs.length>10||data.logs.some(x=>typeof x!=='string'||x.length>2000)||!Number.isInteger(data.barrier)||data.barrier<0||data.barrier>100)throw Error('Invalid match state.');
    const players=data.players.map((p,index)=>({...p,index,controller:'human'}));
    for(const p of players){if(typeof p.name!=='string'||p.name.length>16||!Number.isInteger(p.avatar)||p.avatar<0||p.avatar>5||!Number.isFinite(p.health)||!Number.isFinite(p.maxHealth)||p.maxHealth<1||p.maxHealth>40)throw Error('Invalid player state.');for(const pile of ['hand','deck','field','grave']){if(!Array.isArray(p[pile])||p[pile].length>2000)throw Error('Invalid card pile.');p[pile]=p[pile].map(c=>{if(c.hidden){if(!['hand','deck'].includes(pile))throw Error('Invalid hidden card.');return {uid:c.uid,hidden:true}}validateWireCard(c);return reviveNetwork(c,players)})}}
    for(const key of ['current','barrier','over','animating','revealed','logs','onlineWinner','onlineReason'])state[key]=data[key];
    state.players=players;state.selected=data.selected?findCard(data.selected):null;state.paused=false;
  }
  function validateWireCard(c){
    if(!c||(!Object.hasOwn(MONSTERS,c.name)&&!Object.hasOwn(MAGIC,c.name))||customDefinitions.has(c.name)||c.custom||!Number.isSafeInteger(c.uid)||c.uid<1||![0,1].includes(c.owner?.$player)||c.type!==(MONSTERS[c.name]?'monster':MAGIC[c.name][0])||typeof c.text!=='string'||c.text.length>2000)throw Error('Unsupported online card.');
    if(c.type==='monster'){
      for(const key of ['attack','defense','health','maxHealth','summon','summonLeft','attacks','attacksLeft'])if(!Number.isSafeInteger(c[key])||c[key]<0||c[key]>1000000)throw Error('Invalid card stats.');
      if(c.cinderBurns!==undefined&&(!Number.isSafeInteger(c.cinderBurns)||c.cinderBurns<0))throw Error('Invalid burn animation counter.');
      if(c.maxHealth<1||!Array.isArray(c.effects)||c.effects.length>50)throw Error('Invalid card effects.');
      for(const e of c.effects)if(!e||!(Object.hasOwn(MAGIC,e.name)||['Reaper','Stunned'].includes(e.name))||!Number.isSafeInteger(e.stack)||e.stack<1||e.stack>1000000)throw Error('Invalid card effect.');
    }
  }
  const networkBridge={
    editDeck(config){openDeckBuilder(0,config)},
    closeDeck(){$$('.online-deck-builder').forEach(el=>el.remove())},
    deck:()=>customDecks[0]?[...customDecks[0]]:[],validateDeck:validateOnlineDeck,
    current:()=>state.current,turn:()=>onlineTurn,blocked:()=>state.over||state.paused||state.animating,
    start(rules,host,guest){
      state.session++;state.originalOnly=rules.set==='original';state.selected=null;state.logs=[];state.over=false;state.paused=false;state.animating=false;state.revealed=false;state.barrier=rules.barrier;state.onlineWinner=null;state.onlineReason='';onlineEnded=false;onlineTurn=0;departingCards.clear();visibleCards.clear();lastCardRects.clear();
      state.players=[host,guest].map((p,index)=>({index,name:p.name,avatar:p.avatar,controller:'human',health:rules.health,maxHealth:rules.health,deck:[],hand:[],field:[],grave:[],deploys:1}));
      state.players.forEach((p,i)=>{p.deck=onlineDeck(p,rules,[host,guest][i].deck);openingHand(p)});
      state.current=rules.first==='random'?Math.floor(Math.random()*2):rules.first==='host'?0:1;
      $('#setup').classList.add('hidden');startTurn();
    },
    snapshot:networkSnapshot,draw:render,
    async action(action,seat){
      if(!action||state.current!==seat||state.over||state.paused||state.animating)return;
      if(action.kind==='end'){endTurn();return}
      const card=findCard(action.uid);if(!card)return;
      if(action.kind==='click'){
        if(!['hand','field'].includes(action.zone)||!card.owner[action.zone].includes(card)||(action.zone==='hand'&&card.owner.index!==seat))return;
        return cardClicked(card,action.zone);
      }
      if(card.owner.index!==seat)return;
      const target=findCard(action.target);
      if(action.kind==='play'&&card.owner.hand.includes(card)){
        if(card.type==='monster')return deploy(card);
        if((card.type==='utility'||card.name==='Ice Age')&&playUtility(card)){consume(card);sound('#card-sound');render()}
      }else if(action.kind==='spell'&&target&&playTargeted(card,target)){consume(card);state.selected=null;render()}
      else if(action.kind==='battle'&&target)return battle(card,target);
      else if(action.kind==='attack'&&card.owner.field.includes(card)){state.selected=card;attackPlayer()}
    },
    timeout(){if(!state.over&&!state.animating){log('Turn timer expired.');completeTurn(current())}},
    surrender(seat){if(!state.over)finishGame(1-seat,`${state.players[seat].name} surrendered.`)},
    remoteBattle(packet){
      validateWireCard(packet.attacker);validateWireCard(packet.defender);
      if(packet.reaction&&(![packet.attacker.uid,packet.defender.uid].includes(packet.reaction.uid)||!EMO_QUOTES.includes(packet.reaction.quote)))throw Error('Invalid battle reaction.');
      for(const key of ['attackPower','defensePower','attackRoll','defenseRoll'])if(!Number.isSafeInteger(packet[key])||packet[key]<0||packet[key]>1000000)throw Error('Invalid battle roll.');
      const rolls={initialAttackRoll:packet.initialAttackRoll??packet.attackRoll,initialDefenseRoll:packet.initialDefenseRoll??packet.defenseRoll,steps:packet.charmSteps??[]};
      let ar=rolls.initialAttackRoll,dr=rolls.initialDefenseRoll;const seen=new Set();
      if(!Number.isSafeInteger(ar)||ar<0||ar>packet.attackPower||!Number.isSafeInteger(dr)||dr<0||dr>packet.defensePower||!Array.isArray(rolls.steps)||rolls.steps.length>2)throw Error('Invalid initial battle rolls.');
      for(const step of rolls.steps){
        if(!step||!['attack','defense'].includes(step.side)||seen.has(step.side))throw Error('Invalid charm sequence.');
        const attacking=step.side==='attack',before=attacking?ar:dr,other=attacking?dr:ar,max=attacking?packet.attackPower:packet.defensePower;
        if(step.before!==before||before>=other||step.min!==0||step.max!==max||!Number.isSafeInteger(step.reroll)||step.reroll<0||step.reroll>max||step.kept!==Math.max(before,step.reroll))throw Error('Invalid charm reroll.');
        seen.add(step.side);if(attacking)ar=step.kept;else dr=step.kept;
      }
      if(ar!==packet.attackRoll||dr!==packet.defenseRoll)throw Error('Invalid final battle rolls.');
      const a=reviveNetwork(packet.attacker,state.players),d=reviveNetwork(packet.defender,state.players);
      state.animating=true;state.selected=null;render();
      showBattleCards({...a,attack:packet.attackPower},{...d,defense:packet.defensePower});
      $('#battle-result').textContent='Rolling…';$('#battle-overlay').classList.remove('hidden');$('#battle-overlay .battle-panel').classList.remove('hit','block');
      remoteRoll=showBattleRollSequence(packet.attackPower,packet.defensePower,rolls);remoteRoll.cards=[a,d];remoteRoll.reaction=packet.reaction;
    },
    async receive(data,initial){
      const session=state.session;
      if(initial){state.session++;onlineEnded=false;remoteRoll=null;departingCards.clear();visibleCards.clear();lastCardRects.clear();if($('#modal').open)$('#modal').close();installNetworkState(data);render();return}
      if(remoteRoll){const roll=remoteRoll;await roll;if(session!==state.session)return;
        const all=data.players.flatMap(p=>[...p.field,...p.grave]);
        for(const card of roll.cards){const updated=all.find(c=>c.uid===card.uid);if((updated?.cinderBurns||0)>(card.cinderBurns||0))animateCinderBurn(card)}
        const results=[];for(const [i,card] of roll.cards.entries()){const updated=all.find(c=>c.uid===card.uid);const damage=updated?Math.max(0,card.health-updated.health):0;if(damage){results.push(`${card.name} takes ${damage} damage`);await animateBattleDamage(i===0?'#battle-attacker':'#battle-defender',damage)}}
        if(roll.reaction)await showEmoReaction(roll.reaction.uid===roll.cards[0].uid?'#battle-attacker':'#battle-defender',roll.reaction);
        else $('#battle-result').textContent=results.join(' · ')||'No damage';await wait(340);if(session!==state.session)return;$('#battle-overlay').classList.add('hidden');remoteRoll=null;
      }
      const previous=state.players.flatMap(p=>p.field);
      for(const card of previous){const updated=data.players.flatMap(p=>[...p.field,...p.grave]).find(c=>c.uid===card.uid);const damage=updated?Math.max(0,card.health-updated.health):0;if(damage)animateMonsterDamage(card,damage);if(data.players.some(p=>p.grave.some(c=>c.uid===card.uid))){departingCards.set(card.uid,card);animateCardToGrave(card,100+Math.min(damage,50)*95)}}
      installNetworkState(data);render();
      if(state.over&&!onlineEnded){onlineEnded=true;if([0,1].includes(state.onlineWinner))finishGame(state.onlineWinner,state.onlineReason)}
    },
    disconnect(message){state.session++;state.over=true;state.animating=false;state.selected=null;remoteRoll=null;$('#battle-overlay').classList.add('hidden');showModal(`<h2>Match disconnected</h2><p>${esc(message)}</p><div class="actions"><button data-confirm-menu>Main Menu</button></div>`)}
  };

  $$('.controller').forEach(button=>button.addEventListener('click',()=>{
    const i=+button.dataset.player;state.controllers[i]=button.dataset.value;$$(`.controller[data-player="${i}"]`).forEach(b=>b.classList.toggle('active',b===button));
    syncControllerName(i);
    state.avatars[i]=button.dataset.value==='computer'?0:Math.max(1,state.avatars[i]);$(`#avatar-${i}`).src=`assets/avatar-${state.avatars[i]}.svg`;
  }));
  $$('.avatar-arrow').forEach(button=>button.addEventListener('click',()=>{const i=+button.dataset.avatarPlayer;state.avatars[i]=(state.avatars[i]+ +button.dataset.dir+6)%6;$(`#avatar-${i}`).src=`assets/avatar-${state.avatars[i]}.svg`}));
  $$('[data-custom]').forEach(button=>button.onclick=()=>openDeckBuilder(+button.dataset.custom));
  $('#original-only').addEventListener('change',event=>{
    state.originalOnly=event.target.checked;
    for(let i=0;i<2;i++){customDecks[i]=null;$(`[data-custom="${i}"]`).textContent='Use Custom Deck';$(`#strength-value-${i}`).textContent=$(`#strength-${i}`).value}
    toast(state.originalOnly?'Original card set selected. Custom decks were reset.':'Expanded card set selected. Custom decks were reset.');
  });
  $$('.strength').forEach(input=>input.addEventListener('input',()=>{const i=+input.id.slice(-1);customDecks[i]=null;$(`[data-custom="${i}"]`).textContent='Use Custom Deck';$(`#strength-value-${i}`).textContent=input.value}));
  $('#title-play').addEventListener('click',()=>{$('#title').classList.add('hidden');$('#setup').classList.remove('hidden')});
  $('#setup-main-menu').addEventListener('click',()=>leaveDuel());
  const customReady=window.MMCustom.init({builtins:[...Object.keys(MONSTERS),...Object.keys(MAGIC)],register:registerCustomCards,message:toast});
  $('#create-card').onclick=()=>window.MMCustom.open();
  $('#start-game').disabled=true;customReady.finally(()=>{$('#start-game').disabled=false});
  customReady.finally(()=>online?.init(networkBridge));
  $('#modal').addEventListener('close',()=>{state.paused=$('#modal').open;if(state.players.length)updateTurnControls()});
  state.controllers.forEach((_,i)=>syncControllerName(i));
  if(typeof ResizeObserver!=='undefined'){
    const handResize=new ResizeObserver(layoutHands);$$('.hand').forEach(row=>handResize.observe(row));
  }
  window.addEventListener('resize',layoutHands);
  $$('.field').forEach(row=>{row.addEventListener('wheel',e=>{if(row.scrollWidth>row.clientWidth){e.preventDefault();row.scrollLeft+=e.deltaY||e.deltaX}},{passive:false});row.addEventListener('keydown',e=>{if(e.target===row&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();row.scrollLeft+=(e.key==='ArrowRight'?1:-1)*100}})});
  $('#start-game').addEventListener('click',begin);$('#how-to').addEventListener('click',showRules);$('#menu-button').addEventListener('click',openMenu);$('#end-turn').addEventListener('click',endTurn);$('#opponent-target').addEventListener('click',attackPlayer);
  $('#audio-toggle').addEventListener('click',()=>{audioEnabled=!audioEnabled;$('#audio-toggle').textContent=audioEnabled?'♫ Sound On':'♫ Sound Off';$('#audio-toggle').setAttribute('aria-pressed',String(audioEnabled));syncMenuMusic()});
  document.addEventListener('pointerdown',syncMenuMusic,{once:true,capture:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('button:not(.card):not(.end-turn):not(.opponent-target):not(#audio-toggle)'))sound('#ui-sound')});
  if(typeof MutationObserver!=='undefined')new MutationObserver(syncMenuMusic).observe($('#game'),{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',e=>{if(e.target?.closest?.('input,textarea,select,[contenteditable="true"],#online-chat'))return;if(e.key==='Enter'&&!e.target.closest('button')&&!$('#modal').open&&!$('#game').classList.contains('hidden'))endTurn();if(e.key==='Escape'&&!$('#game').classList.contains('hidden')&&!$('#modal').open)openMenu()});
})();
