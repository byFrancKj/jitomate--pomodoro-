const vscode = require('vscode');
const { exec } = require('child_process');

let sessionInterval;
let sessionRemaining;
let sessionState = 'work';      // 'work' | 'shortBreak' | 'longBreak'
let cycleCount = 0;
const durations = { work: 25*60, shortBreak: 5*60, longBreak: 15*60 };
const totalBlocks = 10;

let pomodoroButton;
let spotifyButton;
let trackItem;
let trackMarquee = '';
let marqueePos = 0;
let marqueeInterval;
let playbackStateInterval;
let lastSpotifyState = '';
let isMuted = false;
let lastVolume = 50;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('🔌 Activando jitomate--pomodoro-');

  // ▶️ Play/Pause Spotify con estado dinámico
  spotifyButton = create('🎵 ▶️','toggleSpotify','Play/Pause Spotify','#c8ddefff',100);
  context.subscriptions.push(
    spotifyButton,
    register('toggleSpotify', () => exec(`osascript -e 'tell application "Spotify" to playpause'`))
  );
  updatePlaybackState();
  playbackStateInterval = setInterval(updatePlaybackState, 2000);
  context.subscriptions.push({ dispose:()=>clearInterval(playbackStateInterval) });

  // ⏮️ Previous Track
  context.subscriptions.push(
    create('⏮️ Previus','prevTrack','Previous Spotify Track','#c8ddefff',99),
    register('prevTrack',   ()=>exec(`osascript -e 'tell application "Spotify" to previous track'`))
  );

  // ⏭️ Next Track
  context.subscriptions.push(
    create('⏭️ Next','nextTrack','Next Spotify Track','#c8ddefff',98),
    register('nextTrack',   ()=>exec(`osascript -e 'tell application "Spotify" to next track'`))
  );

  // 🔉 Volume Down
  context.subscriptions.push(
    create('🔉 –','volumeDown','Spotify Volume Down','#FFAA00',97),
    register('volumeDown',  ()=>exec(`osascript -e 'tell application "Spotify" to set sound volume to (sound volume - 10)'`))
  );

  // 🔊 Volume Up
  context.subscriptions.push(
    create('🔊 +','volumeUp','Spotify Volume Up','#40ff00ff',96),
    register('volumeUp',    ()=>exec(`osascript -e 'tell application "Spotify" to set sound volume to (sound volume + 10)'`))
  );

  // 🔇 Toggle Mute
  context.subscriptions.push(
    create('🔇','toggleMute','Spotify Mute/Unmute','#FF0000',95),
    register('toggleMute',()=>{
      if(!isMuted){
        exec(`osascript -e 'tell application "Spotify" to sound volume as integer'`,(_e,out)=>{
          const vol=parseInt(out);
          if(!isNaN(vol)) lastVolume=vol;
          exec(`osascript -e 'tell application "Spotify" to set sound volume to 0'`);
          isMuted=true;
        });
      } else {
        exec(`osascript -e 'tell application "Spotify" to set sound volume to ${lastVolume}'`);
        isMuted=false;
      }
    })
  );

  // ⏱ Pomodoro con ciclos y descansos
  pomodoroButton = create('','toggleSession','Start/Stop Pomodoro',undefined,94);
  context.subscriptions.push(
    pomodoroButton,
    register('toggleSession',toggleSession)
  );
  resetSession();

  // 🎶 Marquee “Artista – Canción”
  trackItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,101);
  trackItem.color = '#FFFFFF';
  trackItem.show();
  context.subscriptions.push(trackItem);
  updateTrackAndStartMarquee();
}

/** Crea un StatusBarItem y lo muestra */
function create(text,cmd,tooltip,color,priority){
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,priority);
  item.text=text; item.command=`jitomate--pomodoro-.${cmd}`;
  item.tooltip=tooltip;
  if(color) item.color=color;
  item.show();
  return item;
}
/** Registra un comando */
function register(cmd,cb){
  return vscode.commands.registerCommand(`jitomate--pomodoro-.${cmd}`,cb);
}

/** Alterna la sesión de Pomodoro/break */
function toggleSession(){
  if(sessionInterval){
    clearInterval(sessionInterval);
    sessionInterval=undefined;
    resetSession();
  } else {
    if(!sessionRemaining){
      sessionState='work';
      sessionRemaining=durations.work;
    }
    runSession();
  }
}
function runSession(){
  updateSession();
  sessionInterval=setInterval(()=>{
    sessionRemaining--;
    if(sessionRemaining<=0){
      clearInterval(sessionInterval);
      sessionInterval=undefined;
      if(sessionState==='work'){
        cycleCount++;
        vscode.window.showInformationMessage(`✅ Pomodoro ${cycleCount} completado. ¡Hora de descanso!`);
        sessionState = cycleCount%4===0 ? 'longBreak' : 'shortBreak';
      } else {
        vscode.window.showInformationMessage('☕ Descanso terminado. ¡A trabajar!');
        sessionState='work';
      }
      sessionRemaining=durations[sessionState];
      runSession();
    } else {
      updateSession();
    }
  },1000);
}
function resetSession(){
  cycleCount=0;
  sessionState='work';
  sessionRemaining=durations.work;
  pomodoroButton.tooltip='Iniciar Pomodoro';
  updateSession();
}
function updateSession(){
  const total = durations[sessionState];
  const done  = total-sessionRemaining;
  const blocks = Math.floor(done/total*totalBlocks);
  const bar = '['+'▉'.repeat(blocks)+'-'.repeat(totalBlocks-blocks)+']';
  const label = sessionState==='work'?'Work': sessionState==='shortBreak'?'Break':'Long';
  const m=String(Math.floor(sessionRemaining/60)).padStart(2,'0');
  const s=String(sessionRemaining%60).padStart(2,'0');
  pomodoroButton.text=`⏱ ${label} ${bar} ${m}:${s}`;
  pomodoroButton.color = sessionState==='work'? '#00ff1aff' 
                      : sessionState==='shortBreak'? '#e32e16ff'
                      : '#0066CC';
}

/** Actualiza ▶️/⏸️ según estado real */
function updatePlaybackState(){
  exec(`osascript -e 'tell application "Spotify" to player state as string'`,(_e,out)=>{
    const st=out?.trim();
    if(st && st!==lastSpotifyState){
      lastSpotifyState=st;
      spotifyButton.text= st==='playing'?'🎵 ⏸️ Pause':'🎵 ▶️ Play';
    }
  });
}

/** Lógica marquee de Artista – Canción */
function updateTrackAndStartMarquee(){
  exec(
    `osascript -e 'tell application "Spotify" to return artist of current track & " - " & name of current track as string'`,
    (_e,out)=>{
      const base = out?.trim() || 'Spotify detenido';
      trackMarquee = base+'   ';
      marqueePos=0;
      if(marqueeInterval) clearInterval(marqueeInterval);
      marqueeInterval=setInterval(()=>{
        const len=trackMarquee.length;
        const disp=trackMarquee.slice(marqueePos)+trackMarquee.slice(0,marqueePos);
        trackItem.text=`🎶 ${disp}`;
        marqueePos=(marqueePos+1)%len;
      },300);
    }
  );
  setTimeout(updateTrackAndStartMarquee,10000);
}

function deactivate(){
  if(sessionInterval) clearInterval(sessionInterval);
  if(playbackStateInterval) clearInterval(playbackStateInterval);
  if(marqueeInterval) clearInterval(marqueeInterval);
}

module.exports = { activate, deactivate };
