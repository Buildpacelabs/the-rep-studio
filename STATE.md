# The Rep Studio — build state

**Vertical:** Gym & Fitness (industry #2 of the studio program). **Studio name:** The Rep Studio.
**Repo:** Buildpacelabs/the-rep-studio · **Host:** GitHub Pages · **Live:** https://buildpacelabs.github.io/the-rep-studio/

## Pipeline (same as The Pass Studio)
- GitHub Pages. Hub + sitemap via `build_hub.py` from `projects.json` (card renders iff `"built":true` AND `assets/shots/<slug>.jpg` exists).
- Contact = Web3Forms (key `22e61215-5db1-4922-82d8-af16ec5a17e4`) → buildspacelabs@vruoom.com; WhatsApp/call → +91 9315776817.
- Screenshots via Playwright + `python3 -m http.server`; script `screenshot.js`.

## Progress
- [x] Studio name: **The Rep Studio** (collision-checked)
- [x] Brand list: 20 fitness brands (projects.json)
- [x] Repo scaffolded (projects.json, build_hub.py — dark athletic theme, support files)
- [ ] Repo created + Pages enabled + hub live
- [ ] 20 demo sites hand-built (per-brand verify-name phase to flag collisions)
- [ ] Screenshots → hub cards
- [ ] All demos verified live
- [ ] Add "The Rep Studio" card to buildspacelabs.com home "Studios" section

## The 20 brands
See `projects.json`. Archetypes: strength gym, functional/HIIT box, yoga, pilates, cycle, boxing, performance lab, women's strength, powerlifting, martial arts, barre, recovery, run club, climbing, dance fitness, kids academy, outdoor bootcamp, luxury wellness, ashtanga yoga, calisthenics.
