# The Rep Studio — build state

**Vertical:** Gym & Fitness (industry #2 of the studio program). **Studio name:** The Rep Studio.
**Repo:** Buildpacelabs/the-rep-studio · **Host:** GitHub Pages · **Live:** https://buildpacelabs.github.io/the-rep-studio/

## Status: ✅ COMPLETE — 20/20 demos live

## Pipeline (same as The Pass Studio)
- GitHub Pages. Hub + sitemap via `build_hub.py` from `projects.json` (card renders iff `"built":true` AND `assets/shots/<slug>.jpg` exists). Dark athletic hub theme (volt-lime on charcoal, Archivo).
- Contact = Web3Forms (key `22e61215-5db1-4922-82d8-af16ec5a17e4`) → buildspacelabs@vruoom.com; WhatsApp/call → +91 9315776817.
- Screenshots via Playwright + `python3 -m http.server`; script `screenshot.js`.

## Progress
- [x] Studio name **The Rep Studio** (collision-checked)
- [x] Repo + Pages live
- [x] 20 demo sites hand-built (each its own design world)
- [x] Name-collision guardrail: the verify phase flagged 10 hard collisions (fitness naming is saturated; several real same-city businesses). Renamed + rebuilt all 10, then 1 more (Sthira→Ujjayi House) after a re-verify. Colliding pages delisted (404). Final 20 all collision-safe.
- [x] Screenshots → 20 hub cards; all 20 verified live (HTTP 200), forms/images/links checked
- [x] "The Rep Studio" card added to buildspacelabs.com home Studios section (labs repo, branch `antigravity`)

## Renames applied (original → shipped)
Grit Box→Cinderblock Fitness · Cadence Cycle→Voltage Ride House · Kinetic Lab→Slipstream Performance · Barbell Union→Platform 45 · Ronin Martial Arts→Shastra Combat Academy · The Recovery Room→Coldfront Recovery · The Reformer Room→Springline Pilates · Stride Collective→Tarmac Run Club · Sanctum Wellness Club→Vanya Wellness Club · Ashtanga House→Sthira→Ujjayi House. Kept: Forge & Iron, Prana Loft, Southpaw Boxing Club, Lotus Strength, Barre & Bloom, Chalk & Crux, Move Republic, Sprout Sports Academy, Terrain Bootcamp, Rise Calisthenics.

## The 20 brands
See `projects.json` (all `built:true`).

## Next industries
Real Estate → Clinic/Healthcare → Legal → Salon/Spa → Interior/Architecture → Wedding/Events → Automotive → Education → Photography → Boutique Retail. Reuse `build_hub.py` + `projects.json` + `screenshot.js` + the build-spec workflow (scratchpad `rep-build.js`). Run the verify phase early — fitness/wellness names collide heavily.
