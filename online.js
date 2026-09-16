/* NetplayJS protocol v1 adapter. See THIRD-PARTY-NOTICES.md. */
(() => {
  'use strict';
  const VERSION='monster-master-online-v6';
  const SERVER='wss://netplayjs.varunramesh.net/';
  const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const $=s=>document.querySelector(s);
  const options={set:['expanded','original'],strength:[1500,2000,2500],health:[20,30,40],timer:[0,30,60,90],barrier:[0,2,4],first:['random','host','guest'],limits:['normal'],customDeck:[false,true],bothDecks:[false,true]};
  const PUBLIC_RULES=Object.freeze({set:'expanded',strength:2000,health:20,timer:60,barrier:2,first:'random',limits:'normal',customDeck:false,bothDecks:false});
  function validateOptions(value){const out={};for(const [key,allowed] of Object.entries(options)){if(!allowed.includes(value?.[key]))throw Error('Unsupported match rules. Update both copies of the game.');out[key]=value[key]}return out}
  function queueKey(){return VERSION+':public:60s'}
  function profile(value){if(!value||typeof value.name!=='string'||!Number.isInteger(value.avatar)||value.avatar<0||value.avatar>5)throw Error('Invalid player profile.');return {name:value.name.replace(/[<>&"']/g,'').trim().slice(0,16)||'Player',avatar:value.avatar,deck:Array.isArray(value.deck)?value.deck:null}}
  class Transport {
    constructor(callbacks){this.cb=callbacks;this.closed=false;this.signals=Promise.resolve();this.messages=Promise.resolve();this.candidates=[];this.chunks='';this.sendQueue=[]}
    connect(){return new Promise((resolve,reject)=>{
      this.ws=new WebSocket(SERVER);
      this.connectTimer=setTimeout(()=>{reject(Error('The free matchmaking service did not respond. Try again later.'));this.close()},15000);
      this.ws.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.kind==='registration-success'){if(!UUID.test(m.clientID))throw Error('Invalid lobby response.');clearTimeout(this.connectTimer);this.id=m.clientID;this.ice=m.iceServers;resolve(this.id)}else this.signals=this.signals.then(()=>this.signal(m)).catch(e=>this.cb.error(e.message))}catch(e){this.cb.error(e.message)}};
      this.ws.onerror=()=>{reject(Error('Cannot reach the free matchmaking service.'));this.cb.error('Cannot reach the free matchmaking service.')};
      this.ws.onclose=()=>{clearTimeout(this.connectTimer);if(!this.closed&&!this.channel)this.cb.error('Matchmaking connection closed. Please try again.')};
    })}
    lobby(message){if(this.ws?.readyState===1)this.ws.send(JSON.stringify(message))}
    async signal(m){
      if(this.closed)return;
      if(m.kind==='host-match'){this.cb.role(true);this.peer=m.clientIDs[0];this.cb.status('Opponent found. Connecting…');return}
      if(m.kind==='join-match'){this.cb.role(false);this.cb.status('Opponent found. Connecting…');await this.createPeer(m.hostID,true);return}
      if(['server-error','send-message-failure','match-request-failure'].includes(m.kind)){throw Error('This match is unavailable or its host has left. Try another match.')}
      if(m.kind!=='peer-message'||!UUID.test(m.sourceID))return;
      if(this.peer&&this.peer!==m.sourceID)return;
      if(!this.pc){if(m.type!=='offer')return;await this.createPeer(m.sourceID,false)}
      if(m.type==='candidate'){if(this.pc.remoteDescription)await this.pc.addIceCandidate(m.payload);else this.candidates.push(m.payload);return}
      if(m.type==='offer'||m.type==='answer'){
        await this.pc.setRemoteDescription(m.payload);
        for(const c of this.candidates.splice(0))await this.pc.addIceCandidate(c);
        if(m.type==='offer'){await this.pc.setLocalDescription(await this.pc.createAnswer());this.sendSignal('answer',this.pc.localDescription)}
      }
    }
    sendSignal(type,payload){this.lobby({kind:'send-message',destinationID:this.peer,type,payload})}
    async createPeer(id,initiator){
      if(this.pc)return;
      this.peer=id;this.pc=new RTCPeerConnection({iceServers:this.ice});
      this.pc.onicecandidate=e=>{if(e.candidate)this.sendSignal('candidate',e.candidate)};
      this.peerTimer=setTimeout(()=>this.cb.error('Direct connection failed. Try a different network; some networks require a TURN relay that this free service may not provide.'),30000);
      this.pc.onconnectionstatechange=()=>{const s=this.pc.connectionState;if(s==='connected'){clearTimeout(this.peerTimer);clearTimeout(this.disconnectTimer)}if(s==='failed')this.cb.error('Peer connection failed. Please create a new match.');if(s==='disconnected')this.disconnectTimer=setTimeout(()=>this.cb.error('Your opponent disconnected. This match has ended.'),10000)};
      this.pc.ondatachannel=e=>this.attach(e.channel);
      if(initiator){this.attach(this.pc.createDataChannel(VERSION,{ordered:true}));await this.pc.setLocalDescription(await this.pc.createOffer());this.sendSignal('offer',this.pc.localDescription)}
    }
    attach(channel){
      this.channel=channel;channel.bufferedAmountLowThreshold=65536;
      channel.onbufferedamountlow=()=>this.flush();
      channel.onopen=()=>{clearTimeout(this.peerTimer);this.cb.open()};
      channel.onclose=()=>{if(!this.closed)this.cb.error('Your opponent left. This match has ended.')};
      channel.onmessage=e=>{try{if(typeof e.data!=='string'||e.data.length>16001)throw Error('Invalid network packet.');const last=e.data[0]==='!';if(!last&&e.data[0]!=='+')throw Error('Invalid packet framing.');this.chunks+=e.data.slice(1);if(this.chunks.length>2000000)throw Error('Network packet too large.');if(last){const data=JSON.parse(this.chunks);this.chunks='';this.messages=this.messages.then(()=>{if(!this.closed)return this.cb.data(data)}).catch(e=>this.cb.error(e.message))}}catch(e){this.cb.error(e.message)}};
    }
    send(data){if(this.channel?.readyState!=='open')return;const raw=JSON.stringify(data);if(raw.length>2000000)throw Error('Match state exceeded the online transfer limit.');for(let i=0;i<raw.length;i+=8000)this.sendQueue.push((i+8000>=raw.length?'!':'+')+raw.slice(i,i+8000));this.flush()}
    flush(){while(this.sendQueue.length&&this.channel?.readyState==='open'&&this.channel.bufferedAmount<131072)this.channel.send(this.sendQueue.shift())}
    close(){this.closed=true;for(const timer of [this.connectTimer,this.peerTimer,this.disconnectTimer])clearTimeout(timer);this.channel?.close();this.pc?.close();this.ws?.close();this.sendQueue=[]}
  }
  let transport=null,bridge=null,rules=null,me=null,other=null,isHost=false,active=false,ready=false,remoteReady=false,started=false,revision=0,commandID=0,lastCommand=0,pending=false,applying=false,deadline=0,clock=null,deadlineTurn=-1,building=false,receivedOffer=false,mode='private',flow=0;
  const status=text=>{$('#online-status').textContent=text};
  let chatOpen=false,unread=0,lastChatSent=0,lastChatReceived=0;
  function showChat(open){chatOpen=open;$('#chat-panel').classList.toggle('hidden',!open);$('#chat-toggle').setAttribute('aria-expanded',String(open));if(open){unread=0;$('#chat-toggle').textContent='Chat';$('#chat-messages').scrollTop=$('#chat-messages').scrollHeight}}
  function resetChat(){showChat(false);unread=0;lastChatSent=0;lastChatReceived=0;$('#chat-messages').replaceChildren();$('#chat-input').value='';$('#chat-status').textContent='';$('#chat-toggle').textContent='Chat';$('#online-chat').classList.add('hidden')}
  function appendChat(name,text,incoming){const row=document.createElement('p'),author=document.createElement('strong'),body=document.createElement('span');author.textContent=name+': ';body.textContent=text;row.append(author,body);$('#chat-messages').append(row);while($('#chat-messages').children.length>100)$('#chat-messages').firstElementChild.remove();$('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;if(incoming&&!chatOpen){unread++;$('#chat-toggle').textContent=`Chat (${unread})`}}
  function sendChat(event){event.preventDefault();const text=$('#chat-input').value.trim();if(!active||transport?.channel?.readyState!=='open'){ $('#chat-status').textContent='Chat is available during a connected match.';return}if(!text)return;if(text.length>300)return;if(Date.now()-lastChatSent<1000){$('#chat-status').textContent='Please wait a moment before sending again.';return}lastChatSent=Date.now();send({kind:'chat',text});appendChat('You',text,false);$('#chat-input').value='';$('#chat-status').textContent=''}
  function send(data){transport?.send({version:VERSION,...data})}
  function summary(r){return `${r.set==='original'?'Original':'Expanded'} cards · ${r.strength} strength · ${r.health} health · ${r.timer?r.timer+'s turns':'No timer'} · Barrier ${r.barrier} · First: ${r.first}${r.customDeck?r.bothDecks?' · Both players build decks':' · Host builds a deck':''}`}
  function clearStatus(){clearInterval(clock);clock=null;deadline=0;$('#online-clock').textContent='';resetChat()}
  function fail(message){status(message);flow++;bridge.closeDeck();building=false;clearStatus();if(active){active=false;bridge.disconnect(message)}else $('#online').classList.remove('hidden');transport?.close();$('#online-ready').disabled=true;$('#online-cancel').textContent='Back';}
  function readRules(){const out={...PUBLIC_RULES};for(const k of ['set','strength','health','timer','barrier','first']){const v=$(`[data-online="${k}"]`).value;out[k]=['strength','health','timer','barrier'].includes(k)?+v:v}out.customDeck=$('#online-custom-deck').checked;out.bothDecks=out.customDeck&&$('#online-both-decks').checked;return validateOptions(out)}
  function localProfile(){return profile({name:$('#online-name').value,avatar:+$('#online-avatar').value,deck:null})}
  function freezeForm(frozen){$('#online-form').disabled=frozen;$('#online-actions').classList.toggle('hidden',frozen);$('#online-session').classList.toggle('hidden',!frozen)}
  function connected(){status('Connected. Review the rules, then both players press Ready.');if(isHost)send({kind:'offer',rules,player:{...me,deck:null},ready});}
  function review(){
    $('#online-rules').textContent=summary(rules);
    $('#online-players').textContent=`${me.name}${ready?' — Ready':''} vs ${other?.name||'Waiting for opponent'}${remoteReady?' — Ready':''}`;
    $('#online-ready').disabled=!other||ready||building;$('#online-ready').textContent=ready?'Ready — waiting':'Ready';
  }
  function markReady(){
    if(started||building||!me||!rules)return;
    const needsDeck=rules.customDeck&&(isHost||rules.bothDecks);
    if(needsDeck&&!me.deck)throw Error('Build your 40-card deck before pressing Ready.');
    bridge.validateDeck(me.deck,rules);ready=true;
    if(!isHost)send({kind:'profile',player:me});send({kind:'ready'});review();if(isHost&&remoteReady)start();
  }
  function buildDeck(){
    if(building||ready)return;building=true;review();const token=flow;
    bridge.editDeck({name:me.name,rules,deck:me.deck,save(deck){if(token!==flow)return;try{bridge.validateDeck(deck,rules);me.deck=deck;building=false;markReady()}catch(e){fail(e.message)}},cancel});
  }
  async function receive(message){
    try{
      if(message?.version!==VERSION)throw Error('Game versions differ. Both players must use the same updated game.');
      if(message.kind==='chat'){if(active&&typeof message.text==='string'&&message.text.trim()&&message.text.length<=300&&Date.now()-lastChatReceived>=750){lastChatReceived=Date.now();appendChat(other?.name||'Opponent',message.text.trim(),true)}return}
      if(message.kind==='offer'&&!isHost&&!started&&!receivedOffer){receivedOffer=true;rules=validateOptions(message.rules);if(mode==='public'&&JSON.stringify(rules)!==JSON.stringify(PUBLIC_RULES))throw Error('Public match rules do not match the default preset.');other=profile(message.player);remoteReady=message.ready===true;send({kind:'profile',player:me});review();if(rules.customDeck&&rules.bothDecks)buildDeck();return}
      if(message.kind==='profile'&&isHost&&!started&&!remoteReady){other=profile(message.player);bridge.validateDeck(other.deck,rules);if(!rules.bothDecks&&other.deck)throw Error('This match uses a generated guest deck.');review();return}
      if(message.kind==='ready'&&!started&&other){if(isHost&&rules.customDeck&&rules.bothDecks&&!other.deck)throw Error('The guest must finish building their deck.');remoteReady=true;review();if(isHost&&ready)start();return}
      if(message.kind==='start'&&!isHost&&!started&&ready&&other){started=true;active=true;revision=message.revision;deadline=message.deadline?Date.now()+Math.max(0,message.deadline-message.sentAt):0;await bridge.receive(message.state,true);hideLobby();return}
      if(message.kind==='action'&&isHost&&active){await execute(message,1);return}
      if(message.kind==='state'&&!isHost&&active){if(!Number.isInteger(message.revision)||message.revision<=revision)return;revision=message.revision;deadline=message.deadline?Date.now()+Math.max(0,message.deadline-message.sentAt):0;await bridge.receive(message.state,false);pending=false;bridge.draw();return}
      if(message.kind==='battle'&&!isHost&&active){bridge.remoteBattle(message);return}
      if(message.kind==='surrender'&&active&&isHost&&!applying){bridge.surrender(1);publish();return}
      if(message.kind==='leave'){fail('Your opponent left the match.');return}
    }catch(e){fail(e.message)}
  }
  function hideLobby(){$('#online').classList.add('hidden');$('#title').classList.add('hidden');$('#game').classList.remove('hidden');resetChat();$('#online-chat').classList.remove('hidden');clearInterval(clock);clock=setInterval(tick,250);tick()}
  function start(){
    if(started||!isHost||!ready||!remoteReady)return;
    started=true;active=true;revision=0;deadlineTurn=-1;
    bridge.start(rules,me,other);resetDeadline();send({kind:'start',state:bridge.snapshot(1),revision,deadline,sentAt:Date.now()});hideLobby();bridge.draw();
  }
  function resetDeadline(){const turn=bridge.turn();if(turn!==deadlineTurn){deadlineTurn=turn;deadline=rules.timer?Date.now()+rules.timer*1000:0}}
  function publish(){if(!active||!isHost)return;revision++;resetDeadline();send({kind:'state',state:bridge.snapshot(1),revision,deadline,sentAt:Date.now()});}
  async function execute(message,seat){
    if(!active||!isHost)return;
    if(applying)return;
    if(message.revision!==revision||!Number.isSafeInteger(message.id)||message.id<=0||(seat===1&&message.id<=lastCommand)||bridge.current()!==seat||bridge.blocked()){publish();return}
    if(seat===1)lastCommand=message.id;
    applying=true;
    try{await bridge.action(message.action,seat)}finally{applying=false;pending=false;publish();bridge.draw()}
  }
  function input(action){
    if(!active)return false;
    if(pending||applying||bridge.current()!==(isHost?0:1)||bridge.blocked())return true;
    pending=true;const message={kind:'action',action,id:++commandID,revision};
    if(isHost)execute(message,0).catch(e=>fail(e.message));else send(message);
    return true;
  }
  function tick(){
    if(!active)return;
    const remaining=deadline?Math.max(0,Math.ceil((deadline-Date.now())/1000)):null;
    $('#online-clock').textContent=remaining===null?'Online':`Online - ${remaining}s`;
    if(isHost&&remaining===0&&!applying&&!bridge.blocked()){applying=true;Promise.resolve(bridge.timeout()).finally(()=>{applying=false;publish();bridge.draw()})}
  }
  function cancel(){flow++;bridge.closeDeck();building=false;if(active)send({kind:'leave'});transport?.close();transport=null;active=false;started=false;ready=false;remoteReady=false;other=null;pending=false;applying=false;clearStatus();$('#online').classList.add('hidden');$('#title').classList.remove('hidden');freezeForm(false);}
  async function begin(kind){
    try{
      if(!window.RTCPeerConnection||!window.WebSocket)throw Error('This browser does not support online play. Use a current Chrome, Firefox, Edge or Safari browser.');
      flow++;transport?.close();rules=kind==='host'?readRules():{...PUBLIC_RULES};me=localProfile();isHost=kind!=='join';ready=false;remoteReady=false;started=false;other=null;commandID=0;lastCommand=0;pending=false;revision=0;receivedOffer=false;building=false;mode=kind==='public'?'public':kind==='join'?'join':'private';
      freezeForm(true);$('#online-ready').disabled=true;$('#online-share').classList.add('hidden');$('#online-rules').textContent=summary(rules);$('#online-players').textContent='';status('Connecting to the free matchmaking service…');
      const session=new Transport({status,error:fail,role:host=>{isHost=host},open:connected,data:receive});transport=session;
      const id=await session.connect();if(transport!==session||session.closed)return;
      if(kind==='public'){status('Looking for a public opponent… Everyone uses the same default rules.');session.lobby({kind:'match-request',gameID:queueKey(),minPlayers:2,maxPlayers:2})}
      else if(kind==='host'){
        const link=new URL(location.href);link.hash='mm-online='+id;$('#online-invite').value=link.href;$('#online-share').classList.remove('hidden');status('Invite ready. Send the link to your friend and keep this page open.');
        if(rules.customDeck)buildDeck();
      }else{
        const text=$('#online-code').value.trim();const id=text.includes('#')?new URLSearchParams(text.slice(text.indexOf('#')+1)).get('mm-online'):text;
        if(!UUID.test(id||''))throw Error('Paste a valid invite link or room code.');if(id===session.id)throw Error('You cannot join your own match.');status('Joining your friend…');await session.createPeer(id,true);
      }
    }catch(e){fail(e.message)}
  }
  function open(kind='private'){
    if(!bridge)return;$('#title').classList.add('hidden');$('#setup').classList.add('hidden');$('#online').classList.remove('hidden');freezeForm(false);status('Private invites or public matching. Both players use the same game version.');
    mode=kind;$('#online-heading').textContent=kind==='public'?'Play Public Match':kind==='join'?'Join Private Match':'Play Private Match';
    $('#online-private-settings').classList.toggle('hidden',kind!=='private');$('#online-join-area').classList.toggle('hidden',kind==='public');
    $('#online-host').classList.toggle('hidden',kind!=='private');$('#online-public').classList.toggle('hidden',kind!=='public');$('#online-join').classList.toggle('hidden',kind==='public');
    $('#online-public-preset').classList.toggle('hidden',kind!=='public');
    const id=new URLSearchParams(location.hash.slice(1)).get('mm-online');if(id&&UUID.test(id))$('#online-code').value=id;
    if(kind==='join'&&id&&UUID.test(id))return begin('join');
  }
  window.MMOnline={
    init(api){bridge=api;$('#title-public').onclick=()=>open('public');$('#title-private').onclick=()=>open('private');$('#online-host').onclick=()=>begin('host');$('#online-public').onclick=()=>begin('public');$('#online-join').onclick=()=>begin('join');$('#online-back').onclick=cancel;$('#online-cancel').onclick=cancel;
      $('#chat-toggle').onclick=()=>showChat(!chatOpen);$('#chat-close').onclick=()=>showChat(false);$('#chat-form').onsubmit=sendChat;
      $('#online-custom-deck').onchange=()=>{$('#online-both-decks-label').classList.toggle('hidden',!$('#online-custom-deck').checked);if(!$('#online-custom-deck').checked)$('#online-both-decks').checked=false};
      $('#online-ready').onclick=()=>{try{markReady()}catch(e){fail(e.message)}};
      $('#online-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#online-invite').value);status('Invite link copied.')}catch{$('#online-invite').select();status('Select and copy the invite link.')}};
      window.addEventListener('beforeunload',()=>transport?.close());if(new URLSearchParams(location.hash.slice(1)).has('mm-online'))open('join');
    },input,publish,cancel,open,clearStatus,
    get active(){return active},get seat(){return isHost?0:1},get applying(){return applying},get host(){return isHost},get waiting(){return pending},
    battle(data){if(active&&isHost)send({kind:'battle',...data})},
    surrender(){if(!active)return;if(isHost){bridge.surrender(0);publish()}else send({kind:'surrender'})},
    validateOptions,queueKey,Transport,PUBLIC_RULES
  };
})();
