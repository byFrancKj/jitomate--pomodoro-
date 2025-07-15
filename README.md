# jitomate--pomodoro-

A Visual Studio Code extension that integrates a **Pomodoro timer** with **Spotify playback controls** directly in the status bar for macOS users. Improve your productivity with work/break cycles, on‑the‑fly progress visualization, and seamless music control without leaving your editor.

---

## Features

- ⏱ **Pomodoro Work/Break Cycles**  
  - Automatic transition: 25 min work → 5 min short break → every 4th cycle a 15 min long break  
  - 🔴 Work, 🟢 Short Break, 🔵 Long Break  
- 🎛 **Progress Bar** in status bar: visual 10‑block indicator showing session progress  
- 🎵 **Spotify Controls**  
  - Play/Pause, Next/Previous Track  
  - Volume Up/Down, Mute/Unmute (restores previous volume)  
  - Dynamic icon: shows ▶️ or ⏸️ based on actual playback state  
  - Marquee display: scrolls current “Artist – Track” title every 30 sec
 
    
---

## Requirements

- **macOS** (AppleScript required)  
- **Spotify desktop app** installed and running  
- VS Code v1.60.0 or higher  


---

## Known Issues

- ❗️ AppleScript‑based controls only supported on macOS  
- ❗️ If Spotify is closed or unresponsive, controls may fail silently  
- ⚙️ Marquee animation consumes a small amount of CPU due to intervals
- Resources (CPU)  

---

## Release Notes

### 1.0.0

- Initial release with:  
  - Pomodoro timer with automatic breaks and progress visualization  
  - Basic Spotify controls (play/pause, next/prev, volume up/down, mute toggle)  
  - Dynamic playback indicator and scrolling track title display  


---

## For more information

* [VS Code API – StatusBarItem](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem)  
* [Spotify AppleScript API](https://developer.spotify.com/documentation/web-api/)  

**Enjoy using jitomate--pomodoro- and boost your productivity!**

