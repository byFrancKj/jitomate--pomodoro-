Features

⏱ Pomodoro Work/Break Cycles

Automatic transition: 25m work → 5m short break → every 4th cycle a 15m long break

🔴 Work, 🟢 Short Break, 🔵 Long Break

🎛 Progress Bar in status bar: visual 10-block indicator showing session progress

🎵 Spotify Controls

Play/Pause, Next/Previous Track

Volume Up/Down, Mute/Unmute (restores previous volume)

Dynamic icon: shows ▶️ or ⏸️ based on actual playback state

Marquee display: scrolls current “Artist – Track” title every 30 s

![Pomodoro Status](images/pomodoro-status.png)
![Spotify Controls](images/spotify-controls.png)

Requirements

macOS (AppleScript required)

Spotify desktop app installed and running

VS Code v1.60.0 or higher

Extension Settings

This version does not expose any user-configurable settings. Future releases will allow customizing:

jitomate.workDuration

jitomate.shortBreakDuration

jitomate.longBreakDuration

jitomate.progressBlocks

Known Issues

❗️ AppleScript-based controls only supported on macOS

❗️ If Spotify is closed or unresponsive, controls may fail silently

⚙️ Marquee animation consumes a small amount of CPU due to intervals

Release Notes

1.0.0

Initial release with:

Pomodoro timer with automatic breaks and progress visualization

Basic Spotify controls (play/pause, next/prev, volume up/down, mute toggle)

Dynamic playback indicator and scrolling track title display


For more information

VS Code Markdown Support

VS Code API - StatusBarItem

Spotify AppleScript API

Enjoy using jitomate--pomodoro- and boost your productivity!
