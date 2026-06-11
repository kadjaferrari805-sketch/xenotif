# Charte de marque XENOTIF®

## 1. La marque
XENOTIF® — plateforme fitness premium. Symbole « Hexa-Tech » : un **X** (la marque) inscrit dans un **hexagone** (ingénierie, structure, performance). Bi-ton : hexagone **titane** (exigence, durabilité), X **orange** (énergie, action).

## 2. Géométrie (viewBox 0 0 48 48)
- Hexagone : `polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"`, `stroke-width` 2.4, `stroke-linejoin` round.
- X : segments (17.5,17.5)→(30.5,30.5) et (30.5,17.5)→(17.5,30.5), `stroke-width` 4.6, `stroke-linecap` round.
- Petites tailles (≤ 32 px) : épaissir (hexagone 3–3.4, X 5.4–6.2).

## 3. Couleurs
| Rôle | Hex | Token |
|---|---|---|
| Noir profond (fond) | `#0A0B0F` | `--color-sport-dark` |
| Blanc premium | `#FFFFFF` | — |
| Titane (dégradé) | `#FFFFFF → #9CA3AF → #E5E7EB` | `--color-sport-titane` (médian) |
| Orange de marque | `#FF4500` | `--color-sport-orange` |

Le X est **toujours** orange `#FF4500` (jamais une autre teinte) en version bi-ton.

## 4. Typographie
- **Wordmark / titres de marque :** Orbitron (ExtraBold 800), `--font-orbitron`. `XENOTIF` + `®` orange superscript.
- **Texte courant :** Inter (`--font-inter`).

## 5. Variantes du symbole
- **Bi-ton** (défaut) : hexagone titane + X orange. Fonds sombres.
- **Mono blanc** : tout blanc. Sur photo / fond coloré.
- **Mono titane** : tout argent. Usages sobres.

## 6. Lockups
- **Horizontal** : marque + wordmark (header, footer, dashboard, auth).
- **Vertical** : marque au-dessus, wordmark dessous (splash, checkout).
- **Icône seule** : marque sur tuile sombre arrondie (app, favicon).

## 7. Zone de protection & tailles min
- Clear space autour du lockup ≥ hauteur du X.
- Taille mini lisible du lockup horizontal : ~120 px de large ; symbole seul : 16 px.

## 8. Animations
- Intro : tracé du X (~0.6 s) puis une pulsation de lueur orange (~0.9 s).
- Survol header : lift -1 px + glow orange.
- Toujours désactivées sous `prefers-reduced-motion: reduce`.

## 9. À ne pas faire
- Ne pas déformer / incliner / changer les proportions.
- Ne pas recolorer le X hors `#FF4500`.
- Ne pas poser le bi-ton sur un fond chargé sans tuile sombre.
- Ne pas remplacer Orbitron par une autre police pour le wordmark.

## 10. Assets
Source : `public/brand/xenotif-mark.svg` (+ `-mono.svg`). Régénérer les bitmaps : `node scripts/gen-brand-assets.mjs`. Image sociale : `src/app/opengraph-image.tsx` (police `src/app/_assets/Orbitron-ExtraBold.ttf`, TTF statique requis par `@vercel/og`).
