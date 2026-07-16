# 🎬 Creatify — Génération de pubs vidéo

Intégration Creatify.ai (URL → vidéo) pour produire des créatives publicitaires
(UGC / avatars) à partir du site Xenotif.

## 1. Configuration (une fois)

1. Récupère tes clés sur **creatify.ai → Settings → API** (`X-API-ID` + `X-API-KEY`).
2. Renseigne-les dans **`.env.local`** (déjà ajoutées, vides) :
   ```
   CREATIFY_API_ID=ton_api_id
   CREATIFY_API_KEY=ton_api_key
   ```
3. Redémarre le serveur (`npm run dev`).

> Les clés sont des **secrets serveur** (jamais exposées au navigateur). En prod,
> ajoute-les dans les variables d'environnement Vercel.

## 2. Composants

- `src/lib/creatify.ts` — client configuré + helpers `generateAdFromUrl()` / `getAdStatus()`.
- `src/app/api/creatify/route.ts` — route **réservée admin** :
  - `POST /api/creatify` → lance une pub
  - `GET /api/creatify?id=<videoId>` → statut + résultat

## 3. Générer une pub

```bash
# Lance une pub 9:16 (Instagram/TikTok) du site xenotif.com
curl -X POST https://xenotif.com/api/creatify \
  -H "Content-Type: application/json" \
  -b "cookies_de_session_admin" \
  -d '{ "aspectRatio": "9x16", "videoLength": 30, "language": "fr", "targetPlatform": "Instagram" }'
# → { "linkId": "...", "videoId": "..." }
```

Puis suivre le rendu (statut `pending` → `running` → `done`) :

```bash
curl "https://xenotif.com/api/creatify?id=<videoId>" -b "cookies_admin"
# quand status === "done" → champ video_output = URL de la vidéo
```

### Options (`AdOptions`)
`url` (défaut https://xenotif.com) · `aspectRatio` (`9x16`|`16x9`|`1x1`) ·
`videoLength` (s) · `language` (`fr`) · `targetPlatform` (`Instagram`/`Tiktok`/`Facebook`) ·
`targetAudience` · `visualStyle` · `scriptStyle`.

## 4. En code (server-side)

```ts
import { generateAdFromUrl, getAdStatus } from '@/lib/creatify'

const { videoId } = await generateAdFromUrl({ aspectRatio: '9x16', language: 'fr' })
const status = await getAdStatus(videoId) // status.video_output quand 'done'
```

> ⚠️ Chaque génération **consomme des crédits Creatify** (plan payant). La route est
> protégée admin pour éviter tout déclenchement non voulu.
