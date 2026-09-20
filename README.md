# Monster Master — Flash fidelity update

This is your supplied HTML5 game, updated against **Flash game.mp4** and **Html5 game.mp4**. It is a static HTML/CSS/JavaScript project; no build is required to play.

The title menu includes Credits below Instructions. The credit roll includes the supplied Moonkey and EdgyGates portraits, scrolls slowly, and retains a Main Menu button at the top right. Manual scrolling and Escape are supported; reduced-motion users start with automatic scrolling paused. Menu music continues through the credits.

## Run

Extract the entire archive and open `Monster-Master/index.html` in a current desktop browser. Keep every file and the `assets` folder together.

A local server is preferable for consistent custom-card storage and online features. With Python installed, run this inside the `Monster-Master` directory:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Start with **Play Offline**. The full expanded HTML5 card set is selected by default. Turn on **Original cards only** for the smaller Flash-era catalogue.

## What changed

- Matched the 4:3 board proportions: hand and field placement, side piles, avatars, muted red/blue backgrounds and thin gold life bars.
- Restored the orange card backs and lettering from the supplied Flash recording.
- Used individually tinted, text-focused spell faces with translucent artwork from the corresponding supplied assets behind their descriptions. Monster frames also use individual colors, normal artwork brightness, small combat icons and quieter selection feedback. Expanded monsters now have themed muted gradients: green Slime, plum Witch, bronze Werewolf, icy Ghost, wood-gold Mimic, sea-blue Kraken, ochre Cyclops and violet-gray Emo. Combination monsters mix their source families, and upgrades inherit their base monster’s palette.
- Rebuilt the metallic center divider, large orange turn arrow and cyan barrier outline. Played spell names appear briefly on the divider.
- Added the original-style **Ready** dialog at every offline human turn, including games against the computer. Actions and ending the turn are blocked until the dialog closes.
- Reworked battle presentation: square beveled frame, no screen dimming, normal-size cards, sword/shield roll graphics, named effects and ability text under the cards. Damage animates the entire card-and-caption wrapper together, with captions in normal document flow so the enlarging card cannot overlap them. The stronger original hit animation is restored: 35% enlargement, a 7-pixel sideways shake and a bright impact flash over 0.52 seconds. Both the card and captions follow these same keyframes.
- Changed dealing and deployment to card movement from the deck or previous position. Discards travel to the graveyard without the former shrinking/spinning effect.
- Spaced out AI plays and added feedback for direct damage to a player. The AI's card choices and underlying combat rules are retained.
- Removed duplicate floating card previews. Hover or keyboard focus slightly lifts/enlarges the actual card in the hand, field and catalogue. Monster descriptions appear over their artwork. On the field, effect names appear just below the hovered monster on gold (positive) or purple (negative) strips; the text follows the hover movement without being clipped by the scrolling field. Increased attack/defense values are blue and decreased values red. Tiny effect badges are removed. Full descriptions and effect names remain in accessible labels.
- Added **Restart** and **Change Players** to the offline result dialog. Fixed a modal close/reopen race and prevented Enter on a focused button from also ending the turn.
- Retained online play, custom-card creation, expanded cards and deck building. Offline Ready dialogs are excluded from online turns.
- Fixed The Emo's successful 25% heart reaction so its battle card stays anchored while the hearts fly out.
- Removed Pack A Punch from card definitions, deck rules and assets. Added **Upgrade** as a non-monster upgrade card (value 160, limit 1) in the expanded deck pool. Apply it to any friendly symbol monster to transform that target into the corresponding combined monster. An upgraded symbol produces the upgraded combined monster; non-symbol monsters are invalid targets and do not consume the card.
- Renamed **Double Strike** to **Double Hit** throughout its card data, artwork path and effect handling.
- Hands now keep full-size cards visible by increasing their overlap as more cards are drawn, matching Flash without a scrollbar. Hovering brings the actual card forward.
- Center card announcements have a soft white oval glow that appears and fades together with the text.
- Lightning, Fireball, Flood and Black Hole use the supplied original Flash vector timelines at 25 frames per second, with transparent backgrounds and placement based on the reference videos. Stat changes use the supplied 40-frame expanding circle, centered on the changed number: yellow for increases, purple/red for decreases. Berserk and Curse animate each changed stat separately; unchanged stats do not flash. Health changes, including healing, never trigger stat circles. Overlays survive board redraws, expire automatically, clear on leaving a match, and replay once per event for online opponents. The existing health explosion is unchanged.
- The high-resolution supplied card back replaces the old image on both draw piles and hidden hands.
- `flash-sprites.js` contains the adapted original vector timelines; `flash-effects.js` controls their placement and lifetime. The import script in `tests` rebuilds the timelines from the four supplied ZIP exports and the retained stat-circle reference in `tests/fixtures`. Run `node tests/import-flash-sprites.cjs --stat-only` to rebuild just the circle. Native canvas rendering and effect lifecycle tests accompany the gameplay regression checks; in-browser visual verification remains outstanding.
- Stun uses the greyed-out monster art without an overlay. Freeze keeps its decal and deals 1 frostbite damage on thawing, including removal by Cleanse. Frost Wraith is immune. The first freeze extinguishes Cinder Hound into Hound, preserving current stats and health; Hound loses all fire powers and can be frozen normally by subsequent freezes.
- New expanded cards: Lucky Charm (value 60, limit 2), Exhaustion (30, 3), Ice Age (100, 1), Frost Wraith (60, 2), and Cinder Hound (55, 2), using the supplied artwork. Double-click Ice Age in your hand to affect every eligible enemy without selecting a target; keyboard activation also works. Hound uses the supplied artwork and is available through transformation only.
- Lucky Charm shows the original battle roll, announces "Lucky charm" in a white glow beneath the affected die, rerolls that die, then displays the better result in yellow. It removes its attached effect; ties leave the charm attached. If the winner changes, the other monster may use its own charm. Online players see the same sequence.
- Frost Wraith always freezes eligible enemies on damaging battle hits. Cinder Hound defeats Frost Wraith on a damaging hit; against other monsters, a damaging hit has a 75% chance to deal 1 immediate extra burn damage. A brief flame burst covers the burned enemy, including during online battle playback; reduced-motion mode uses a static glow.
- Overflowing card descriptions scroll slowly on hover or keyboard focus, pausing at the beginning and end. Long battle notes scroll automatically. Automatic scrolling respects reduced-motion preferences.
- Cinder Hound is immune to Fireball and bonus burn damage. Its successful bonus burn thaws frozen targets without frostbite, while retaining the fire damage. This interaction is intentionally omitted from its card description.
- Ghost only curses its attacker if it survives the whole hit, including bonus damage. Exhaustion requires more than one remaining attack. Menu music continues throughout selection screens and stops when a match begins.

Most presentation changes live in `classic.css`, loaded after the supplied `styles.css`. Behavior changes are in `game.js`; `index.html` loads the new stylesheet and `asset-fallbacks.js`. The supplied `styles.css`, `custom-cards.js` and `online.js` are unchanged.

## Restored assets

The supplied `assets.zip` is integrated. Its active files are included byte-for-byte, except for the retired Pack A Punch image and the old Double Strike filename. Double Hit reuses those original pixels under its new name. The active set includes:

- all six original SVG avatars, used on the board, in setup and in controller selectors;
- the original title Minotaur and full-resolution Dragon illustration;
- expanded and upgraded monster artwork;
- the frozen, stunned and upgrade overlay images;
- the original card, hit and UI sounds, plus menu music.

Temporary avatar/title substitutions, video-cropped Dragon artwork, CSS-only status substitutes and synthesized sound effects have been replaced. Every built-in monster's image path—including aliases and every render zone—resolves to a bundled file. A neutral silhouette remains only as error recovery for damaged or missing user-imported images; no built-in card depends on it.

The orange Flash-style card back from the previous fidelity pass is retained as `assets/classic-card-back.svg`. The supplied `assets/card-back.svg` is also included unchanged; it contains the plain red face seen in the HTML5 recording. The game uses the orange version to preserve the reference look. The turn arrow, selection arrows and sword/shield icons from the fidelity pass are also retained.

The active spell illustrations are displayed as translucent decals. The SVG emblems in `assets/decals/` are derived from the supplied artwork with plain card backgrounds removed and the full portrait viewport restored; their relative translucency is preserved with stronger opacity for clearer emblems. Expanded PNG illustrations use brighter themed faces (including periwinkle Freeze and red Berserk), larger decals at 42% opacity and smaller, centered body text. CSS silhouette clipping removes the background around Freeze, Berserk, Time Warp and Monster Egg without changing their source PNGs; soft display masks blend the flame, cloud and undead artwork into their faces. `tests/build-decals.py` regenerates the SVG derivatives. Curse, Summon and Doom contain no separate emblem in the supplied SVGs, so those faces remain plain. The retired Pack A Punch artwork was removed, and the renamed Double Hit art is stored as `assets/c-double-hit.png`.

## Verification

The included automated checks pass:

- single-player Ready gate and escaped player names;
- opening deal, one-monster deployment limit and targeted spells;
- spell announcements, accessible card labels and spell-face markup;
- battle effect/ability captions and shared card/caption damage animation;
- hover effect labels, cleanup, absence of duplicate previews and colored modified stats;
- stationary Emo heart reactions, Upgrade's targeted base/upgraded transformations and rejection of non-symbol targets, Double Hit naming and crowded-hand overlap calculations;
- completion of normal and reduced-motion battle code paths;
- AI transition back to a paused human turn;
- expanded catalogue enabled by default, original-card catalogue, Fill and Save;
- clean restarts, victory Restart and modal reopen behavior;
- exclusion of offline Ready dialogs from online turns;
- rendering every defined monster and spell without a JavaScript exception, with an explicit frame palette for every built-in monster and upgrade;
- existence of every built-in image, status overlay, avatar, audio and CSS asset;
- JavaScript syntax and parsing both stylesheets.

Run them from this directory with:

```sh
npm install
npm test
```

The retained supplied assets were compared byte-for-byte, PNGs were decoded, SVGs were parsed, and all four MP3 files were inspected successfully. The derived SVG decals were rendered and inspected together. Custom-card and online code remains unchanged.

These are DOM/state regression checks. Layout, media and animation browser APIs are stubbed, as are custom-card storage and the online adapter. **A live browser visual/play test was blocked by the environment's local-file and local-server navigation policy.** Pixel alignment, real animation playback, mobile layout, sound playback and two-client online play remain unverified. This is a fidelity pass, not a claim of pixel-perfect equivalence.

For a final browser check, use an 800×600 or 4:3 window: start a duel, acknowledge Ready, deploy a monster, cast a spell, end the turn, battle after the barrier expires, hover cards, restart, and try a narrow/mobile window. If using online play, verify a match between two updated clients before distributing it.

Latest refinements: Fireball renders above the damage-card layer; long spell names fit in full; Barrier and Combine use the supplied full-card SVG artwork. Catalog cards allow vertical touch scrolling. Credits show EdgyGates without a prefix and have only the Main Menu control. The supplied favicon bundle and requested search description are included, with a canonical URL of https://monstermaster.net/. Upload the complete folder contents, including icons and site.webmanifest, to the website root.

The main-menu Monster Master wordmark now uses a bundled chancery-style font and the original screenshot's broad sizing, two-line spacing and right-shifted “Master” placement. “Remastered” remains a small gold subtitle. The sound control is an icon-only, hand-drawn-style speaker with a crossed-out muted state and accessible labels. The deck catalogue uses 320-pixel WebP previews with lazy asynchronous decoding (about 0.27 MB for all built-in monsters instead of loading roughly 15.4 MB of full PNGs); cards used during gameplay retain their original full-resolution artwork.
