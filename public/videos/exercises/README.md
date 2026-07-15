# Vidéos de démonstration des exercices

Dépose ici une vidéo `.mp4` (fond blanc studio conseillé) nommée par le **slug**
de l'exercice - elle est jouée automatiquement sur `/exercices/<slug>`.

- Vidéo : `public/videos/exercises/<slug>.mp4`
- Poster (optionnel) : `public/videos/exercises/<slug>.jpg`
- Si aucune vidéo → repli automatique sur le GIF d'animation studio.

## Import automatique (recommandé)

Mets tes vidéos brutes (n'importe quel nom/format) dans un dossier, puis :

```bash
node scripts/import-exercise-videos.mjs "/chemin/vers/ton/dossier"
# options : --dry (aperçu)  --commit  --height 720  --crf 30  --min 55
```

Le script : mappe chaque vidéo à un exercice (par slug ou par nom fr/en/de),
l'optimise (H.264 muet + faststart), génère le poster, l'écrit en `<slug>.mp4`.
Le plus sûr : nomme ton fichier directement `<slug>.mp4`.

Correspondance slug ↔ noms : `scripts/exercise-names.json` (62 exercices).
