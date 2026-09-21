# Monster Master Remastered

**Monster Master Remastered** is an HTML5 recreation of the original Flash card-battle game created by **Matthew Stradwick (Moonkey)**. The remaster was developed by **EdgyGates** to preserve the original game's look and feel while making it playable in modern web browsers without Adobe Flash.

Build a 40-card deck, summon monsters, play special cards, and defeat your opponent in turn-based battles. You can play locally against the computer or another person, create custom decks and monsters, or use the optional online multiplayer modes.

## Play offline

Monster Master does not need to be installed and does not need an internet connection for offline play.

1. Open this repository's GitHub page.
2. Select **Code**, then **Download ZIP**.
3. Extract the entire ZIP file. Do not move `index.html` away from the other game files.
4. Open the extracted `dist` folder.
5. Double-click `index.html` to launch the game in a modern browser.
6. Choose **Play Offline** from the main menu.

Chrome, Firefox, Edge, and Safari are recommended. Sound may begin only after your first click because modern browsers prevent websites from playing audio automatically.

### If the game does not open correctly

Most browsers can run the game directly from `dist/index.html`. If your browser restricts local files, start a small local web server instead.

With Python installed, open a terminal in the repository folder and run:

```bash
python -m http.server 8000 --directory dist
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser. Stop the server with `Ctrl+C` when you finish playing.

## Offline game modes

- Play against the computer without revealing the computer's hand.
- Play a local two-player match on the same device.
- Use the original card set or the expanded remastered set.
- Generate a randomized 40-card deck or build your own custom deck.
- Create and import custom monster cards with your own artwork, statistics, and abilities.

Custom cards and settings are stored in the browser used to create them. Export important custom cards if you want a backup or plan to move them to another browser or device.

## How to play

Monster Master is a turn-based card game. Each player uses monster and special cards to control the battlefield and reduce the opposing player's health to zero.

- Drag a monster from your hand onto your side of the battlefield, or select it and then select the field.
- Some monsters must finish summoning before they can attack.
- Drag a ready monster toward an opposing monster or the opposing player to attack.
- Play special cards to damage, heal, strengthen, weaken, summon, or otherwise affect cards in play.
- Select **End Turn**, or press `Enter`, when you are finished.
- Press `Escape` to open the in-game menu.
- Hover over an active card to read its description and abilities.

The opening barrier prevents immediate direct attacks on a player. Once it disappears, monsters can attack the opposing player when no rule or card effect prevents it.

## Features

- Faithful recreation of the original Flash presentation and card-battle system
- Original and expanded monster-card collections
- Animated summoning, attacks, damage, status effects, and card movement
- Monster combinations that create powerful super monsters
- Custom 40-card deck builder
- Custom monster-card creator with imported images and animated GIF support
- Computer and local two-player opponents
- Responsive controls and layouts for desktop and mobile screens
- Music, sound effects, scrolling credits, and remastered presentation
- Optional public and private peer-to-peer online matches with opponent chat

## Optional online play

**Play Public Match** and **Play Private Match** require an internet connection. The game itself can be hosted as static files and does not require the project owner to operate a game server. It uses NetplayJS's shared matchmaking/signaling service to establish WebRTC peer-to-peer matches.

The availability of online play depends on that free external service and both players' networks. Private invite links last only while the host keeps the lobby open. Both players should use the same version of the game.

Custom or imported monster cards are currently intended for offline play and are not transferred to an online opponent.

## Project structure

```text
dist/                    Playable browser build
  index.html             Game entry point
  game.js                Core rules and gameplay
  online.js              Online lobby and synchronization
  custom-cards.js        Custom card editor and storage
  styles.css             Interface, cards, and animations
  assets/                Artwork, music, and sound effects
tests/                   Automated rules and online tests
THIRD-PARTY-NOTICES.md   Third-party software acknowledgements
```

The game is written with standard HTML, CSS, and JavaScript. No Flash Player, package installation, build step, account, API key, or paid subscription is required to play the included build.

## Development and testing

The files in `dist` form the playable version and can be served by any static web host. After changing the rules or network code, run the included automated checks with Node.js:

```bash
node tests/rules.test.cjs
node tests/online.test.cjs
```

These tests check core card rules and simulated online synchronization. They do not replace visual testing in a browser, particularly on mobile devices.

---

**Build your deck. Summon your monsters. Become the Monster Master.**
