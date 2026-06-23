# Créa pub — « 200 € vs 9,99 € » version PHOTO (avec personnages)

Version « pro » du concept V1 : diaporama animé (Ken Burns) sur de **vraies photos d'athlètes** (Pexels), 9:16, pour Meta/Google Ads. Remplace la version texte seule (`../ad-prix-200-vs-999/`).

- **`ad-prix-photo.mp4`** — 1080×1920, 13 s, 30 fps (~5 Mo). **Sans musique** (voir note).
- **`source.html`** — composition HyperFrames re-rendable.
- **`bg1/2/3.jpg`** — photos Pexels (muscu N&B · pompes kettlebells · salle premium).
- **`preview-scene1.png`** — aperçu.

**3 scènes :** athlète muscu + comparaison prix (200 € barré → 9,99 €) → pompes kettlebells + « 20× moins cher » + disciplines → salle premium + CTA « 7 jours gratuits / sans engagement » + logo + xenotif.com.

## ⚠️ Musique
Aucun générateur de musique n'était disponible localement (Higgsfield = TTS only, Runway = 0 crédit, MusicGen local = RAM insuffisante). **Ajouter la musique au moment de l'upload** dans le gestionnaire Meta/TikTok (bibliothèques musicales libres de droits intégrées) — c'est gratuit, licencié, et sans risque de copyright. Ou fournir un MP3 libre de droits à muxer (`ffmpeg -i video.mp4 -i music.mp3 -c:v copy -shortest out.mp4`).

**Re-render :** placer `source.html` + les 3 jpg dans un projet `npx hyperframes init`, puis `npx hyperframes render . -q high`.
