#!/usr/bin/env python3
"""Generate The Rep Studio hub (index.html) and sitemap.xml from projects.json.

Single source of truth for the hub. Re-run after each demo goes live:
    python3 build_hub.py
Only projects with "built": true are rendered as cards and added to the sitemap.
Card thumbnails use assets/shots/<slug>.jpg when present, else the accent gradient.
"""
import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = "https://buildpacelabs.github.io/the-rep-studio"
TODAY = os.environ.get("BUILD_DATE", "2026-07-18")

with open(os.path.join(ROOT, "projects.json"), encoding="utf-8") as f:
    projects = json.load(f)

built = [p for p in projects if p.get("built")]
total = len(projects)

def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))

seen, tags = set(), []
for p in projects:
    c = p["cuisine"]
    if c not in seen:
        seen.add(c); tags.append(c)
marquee_items = "".join(f'<span>{esc(t)}</span><i aria-hidden="true">&#10022;</i>' for t in tags)
marquee = marquee_items * 2

def card(p):
    slug = p["slug"]; shot = f"assets/shots/{slug}.jpg"
    has_shot = os.path.exists(os.path.join(ROOT, shot))
    grad = f"linear-gradient(135deg,{p['from']},{p['to']})"
    if has_shot:
        thumb = (f'<img src="{shot}" width="1440" height="900" loading="lazy" decoding="async" '
                 f'alt="Home page of {esc(p["brand"])}, a {esc(p["cuisine"].lower())} website built by The Rep Studio">')
    else:
        thumb = (f'<div class="thumb-fallback" style="background:{grad}">'
                 f'<span>{esc(p["brand"])}</span></div>')
    return f'''      <a class="card" href="{slug}/" aria-label="View the live {esc(p["brand"])} site">
        <span class="card-accent" style="background:{grad}" aria-hidden="true"></span>
        <div class="card-thumb">{thumb}</div>
        <div class="card-body">
          <div class="card-meta">
            <span class="card-tag">{esc(p["cuisine"])}</span>
            <span class="card-geo">{esc(p["city"])} &middot; <span class="coords">{esc(p["coords"])}</span></span>
          </div>
          <h3 class="card-name">{esc(p["brand"])}</h3>
          <span class="card-live">View live<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
        </div>
      </a>'''

cards_html = "\n".join(card(p) for p in built) if built else \
    '      <p class="grid-empty">The first brands are coming online now — check back shortly.</p>'

og_image = f"{BASE}/assets/shots/{built[0]['slug']}.jpg" if built else f"{BASE}/assets/og-cover.png"

CSS = """
    :root{
      --bg:#0D0E11; --bg-2:#121317; --surface:#16181D; --ink:#F2F3F5; --ink-soft:#AEB4BC;
      --ink-faint:#7C828B; --line:#262A31; --line-soft:#1F232A;
      --volt:#C7F04A; --volt-deep:#B6E23A; --heat:#FF5A1F;
      --shadow:0 1px 2px rgba(0,0,0,.4),0 16px 40px rgba(0,0,0,.4);
      --shadow-lg:0 2px 8px rgba(0,0,0,.5),0 34px 70px rgba(0,0,0,.6);
      --ease:cubic-bezier(.16,1,.3,1);
      --disp:'Archivo',system-ui,sans-serif; --sans:'Inter',system-ui,sans-serif;
      --mono:'Space Grotesk',ui-monospace,monospace;
    }
    *{margin:0;padding:0;box-sizing:border-box}
    html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
    body{font-family:var(--sans);background:var(--bg);color:var(--ink);line-height:1.6;
      -webkit-font-smoothing:antialiased;overflow-x:hidden}
    a{color:inherit;text-decoration:none}
    img{max-width:100%;height:auto;display:block}
    .wrap{max-width:1180px;margin:0 auto;padding:0 30px}
    ::selection{background:var(--volt);color:#0D0E11}

    header{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--bg) 82%,transparent);
      backdrop-filter:saturate(160%) blur(12px);border-bottom:1px solid var(--line)}
    .nav{display:flex;align-items:center;justify-content:space-between;height:70px}
    .brand{display:flex;align-items:center;gap:11px;font-family:var(--disp);font-weight:800;
      font-size:1.1rem;letter-spacing:-.02em;text-transform:uppercase}
    .brand-mark{width:32px;height:32px;border-radius:9px;background:var(--volt);color:#0D0E11;
      display:grid;place-items:center;flex:0 0 auto}
    .brand-mark svg{width:19px;height:19px}
    .nav-links{display:flex;align-items:center;gap:30px}
    .nav-links a{font-size:.92rem;color:var(--ink-soft);font-weight:500;transition:color .2s var(--ease)}
    .nav-links a:hover{color:var(--volt)}
    .nav-cta{padding:9px 17px;border-radius:999px;background:var(--volt);color:#0D0E11!important;
      font-weight:700;font-size:.88rem;transition:transform .2s var(--ease),filter .2s var(--ease)}
    .nav-cta:hover{transform:translateY(-1px);filter:brightness(1.08)}
    @media(max-width:760px){.nav-links a:not(.nav-cta){display:none}}

    .hero{padding:90px 0 42px;position:relative}
    .hero::before{content:"";position:absolute;inset:-10% 0 auto 40%;height:420px;
      background:radial-gradient(closest-side,color-mix(in srgb,var(--volt) 14%,transparent),transparent);
      pointer-events:none;filter:blur(10px)}
    .eyebrow{font-family:var(--mono);font-size:.74rem;font-weight:600;letter-spacing:.18em;
      text-transform:uppercase;color:var(--volt);display:inline-flex;align-items:center;gap:10px;position:relative}
    .eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--volt);
      box-shadow:0 0 0 4px color-mix(in srgb,var(--volt) 20%,transparent)}
    .hero h1{font-family:var(--disp);font-weight:800;font-size:clamp(2.7rem,1.5rem+4.8vw,5.4rem);
      line-height:.98;letter-spacing:-.03em;margin:22px 0 0;max-width:16ch;text-transform:uppercase;position:relative}
    .hero h1 em{font-style:normal;color:var(--volt)}
    .hero p.lead{margin:24px 0 0;max-width:58ch;font-size:1.16rem;color:var(--ink-soft);position:relative}
    .hero-actions{margin-top:34px;display:flex;flex-wrap:wrap;gap:14px;position:relative}
    .btn{display:inline-flex;align-items:center;gap:9px;font-weight:700;font-size:.98rem;
      padding:14px 24px;border-radius:999px;transition:transform .2s var(--ease),filter .2s var(--ease),background .2s var(--ease)}
    .btn-solid{background:var(--volt);color:#0D0E11}
    .btn-solid:hover{transform:translateY(-2px);filter:brightness(1.08)}
    .btn-ghost{border:1px solid var(--line);color:var(--ink)}
    .btn-ghost:hover{border-color:var(--volt);color:var(--volt);transform:translateY(-2px)}

    .marquee{margin-top:56px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
      padding:16px 0;overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
      mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
    .marquee-track{display:inline-flex;align-items:center;gap:26px;white-space:nowrap;
      animation:scroll 44s linear infinite;font-family:var(--disp);font-weight:800;font-size:1.3rem;
      text-transform:uppercase;letter-spacing:.02em;color:var(--ink)}
    .marquee-track i{color:var(--volt);font-style:normal}
    @keyframes scroll{to{transform:translateX(-50%)}}

    section.block{padding:78px 0}
    .kicker{font-family:var(--mono);font-size:.74rem;font-weight:600;letter-spacing:.16em;
      text-transform:uppercase;color:var(--ink-faint)}
    .sec-head{max-width:62ch;margin-bottom:40px}
    .sec-head h2{font-family:var(--disp);font-weight:800;font-size:clamp(1.9rem,1.3rem+2vw,2.9rem);
      letter-spacing:-.02em;line-height:1.06;margin-top:14px;text-transform:uppercase}
    .sec-head p{margin-top:14px;color:var(--ink-soft);font-size:1.08rem;text-transform:none}

    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
    @media(max-width:1000px){.grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:660px){.grid{grid-template-columns:1fr;max-width:460px;margin:0 auto}}
    .grid-empty{grid-column:1/-1;color:var(--ink-faint);font-style:italic}
    .card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:16px;
      overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column;
      transition:transform .4s var(--ease),box-shadow .4s var(--ease),border-color .4s var(--ease);
      opacity:0;transform:translateY(22px)}
    .card.in{opacity:1;transform:none}
    .card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:color-mix(in srgb,var(--volt) 40%,var(--line))}
    .card-accent{position:absolute;inset:0 0 auto 0;height:4px;z-index:2}
    .card-thumb{aspect-ratio:16/10;overflow:hidden;background:var(--line-soft);border-bottom:1px solid var(--line)}
    .card-thumb img{width:100%;height:100%;object-fit:cover;object-position:top center;transition:transform .6s var(--ease)}
    .card:hover .card-thumb img{transform:scale(1.05)}
    .thumb-fallback{width:100%;height:100%;display:grid;place-items:center;padding:20px;text-align:center}
    .thumb-fallback span{font-family:var(--disp);font-weight:800;font-size:1.4rem;color:#fff;text-transform:uppercase;
      text-shadow:0 2px 12px rgba(0,0,0,.4)}
    .card-body{padding:20px 22px 22px;display:flex;flex-direction:column;gap:9px;flex:1}
    .card-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
    .card-tag{font-family:var(--mono);font-size:.68rem;font-weight:600;letter-spacing:.08em;
      text-transform:uppercase;color:var(--volt);background:color-mix(in srgb,var(--volt) 12%,transparent);
      padding:4px 9px;border-radius:6px}
    .card-geo{font-size:.76rem;color:var(--ink-faint)}
    .card-geo .coords{font-family:var(--mono);font-size:.72rem}
    .card-name{font-family:var(--disp);font-weight:800;font-size:1.3rem;letter-spacing:-.01em;
      text-transform:uppercase;margin-top:2px}
    .card-live{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-weight:700;
      font-size:.9rem;color:var(--volt)}
    .card-live svg{transition:transform .25s var(--ease)}
    .card:hover .card-live svg{transform:translate(3px,-3px)}

    .studio{background:var(--bg-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
    .services{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:8px}
    @media(max-width:900px){.services{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:520px){.services{grid-template-columns:1fr}}
    .svc{padding:26px 22px;background:var(--surface);border:1px solid var(--line);border-radius:14px}
    .svc-n{font-family:var(--mono);font-size:.78rem;color:var(--volt);font-weight:600}
    .svc h3{font-family:var(--disp);font-weight:800;font-size:1.18rem;margin:12px 0 8px;
      letter-spacing:-.01em;text-transform:uppercase}
    .svc p{font-size:.95rem;color:var(--ink-soft)}

    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center}
    @media(max-width:720px){.stats{grid-template-columns:repeat(2,1fr);gap:34px 20px}}
    .stat .n{font-family:var(--disp);font-weight:800;font-size:clamp(2.4rem,1.6rem+2.4vw,3.6rem);
      letter-spacing:-.02em;line-height:1;color:var(--volt)}
    .stat .l{margin-top:8px;font-size:.9rem;color:var(--ink-soft)}

    .cta{background:linear-gradient(135deg,#16181D,#0F1013);border:1px solid var(--line);
      border-radius:24px;padding:64px 48px;text-align:center;position:relative;overflow:hidden}
    .cta::after{content:"";position:absolute;inset:0;background:
      radial-gradient(600px 300px at 50% -10%,color-mix(in srgb,var(--volt) 22%,transparent),transparent 70%);pointer-events:none}
    .cta h2{font-family:var(--disp);font-weight:800;font-size:clamp(2rem,1.4rem+2.4vw,3.2rem);
      letter-spacing:-.02em;text-transform:uppercase;position:relative}
    .cta p{margin:16px auto 0;max-width:52ch;color:var(--ink-soft);position:relative}
    .cta-actions{margin-top:30px;display:flex;flex-wrap:wrap;gap:14px;justify-content:center;position:relative}

    footer{padding:52px 0 60px;border-top:1px solid var(--line);margin-top:6px}
    .foot{display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:space-between}
    .foot-brand{font-family:var(--disp);font-weight:800;font-size:1.02rem;text-transform:uppercase;
      display:flex;align-items:center;gap:10px}
    .foot-note{font-size:.86rem;color:var(--ink-faint)}
    .foot a.plain{color:var(--ink-soft);font-size:.9rem}
    .foot a.plain:hover{color:var(--volt)}

    @media(prefers-reduced-motion:reduce){
      *{animation:none!important;transition:none!important;scroll-behavior:auto!important}
      .card{opacity:1;transform:none}
      .marquee-track{animation:none}
    }
"""

MARK_SVG = ('<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">'
            '<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" stroke="currentColor" '
            'stroke-width="2" stroke-linecap="round"/></svg>')

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>The Rep Studio — Websites for Gyms, Studios &amp; Fitness Brands</title>
  <meta name="description" content="The Rep Studio designs and hand-builds fast, high-energy websites for gyms, yoga and pilates studios, boxes and wellness brands — {total} brands built, each its own design world, no templates. A BuildspaceLabs atelier.">
  <link rel="canonical" href="{BASE}/">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#0D0E11">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="The Rep Studio">
  <meta property="og:title" content="The Rep Studio — Websites for Gyms, Studios &amp; Fitness Brands">
  <meta property="og:description" content="We hand-build fast, distinctive websites for fitness &amp; wellness brands. {total} brands, each its own design world, no templates. A BuildspaceLabs atelier.">
  <meta property="og:url" content="{BASE}/">
  <meta property="og:image" content="{og_image}">
  <meta property="og:image:alt" content="A grid of gym and fitness-studio websites built by The Rep Studio.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="The Rep Studio — Websites for Gyms, Studios &amp; Fitness Brands">
  <meta name="twitter:description" content="Fast, hand-built websites for fitness &amp; wellness brands. A BuildspaceLabs atelier.">
  <meta name="twitter:image" content="{og_image}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230D0E11'/%3E%3Cpath d='M7 12v8M10 10v12M22 10v12M25 12v8M10 16h12' stroke='%23C7F04A' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {{
    "@context":"https://schema.org","@type":"CollectionPage",
    "name":"The Rep Studio — Fitness & Wellness Web Design",
    "description":"A studio that designs and hand-builds websites for gyms, studios and fitness brands.",
    "url":"{BASE}/",
    "publisher":{{"@type":"Organization","name":"BuildspaceLabs","url":"https://buildspacelabs.com",
      "parentOrganization":{{"@type":"Organization","name":"Vruoom"}}}}
  }}
  </script>
  <style>{CSS}</style>
</head>
<body>
  <header>
    <div class="wrap nav">
      <a class="brand" href="./" aria-label="The Rep Studio home">
        <span class="brand-mark">{MARK_SVG}</span> The Rep Studio
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#studio">Studio</a>
        <a href="#offer">Offer</a>
        <a class="nav-cta" href="#start">Start a project</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero wrap" aria-labelledby="hero-title">
      <span class="eyebrow">Fitness &amp; wellness digital studio &middot; A BuildspaceLabs atelier</span>
      <h1 id="hero-title">We build fitness brands people <em>show up</em> for.</h1>
      <p class="lead">Great gyms lose members to forgettable websites. We rebuild studios, boxes and wellness brands into fast, high-energy sites that fill classes and sell memberships — mobile-first, and unmistakably their own.</p>
      <div class="hero-actions">
        <a class="btn btn-solid" href="#work">Selected work
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
        </a>
        <a class="btn btn-ghost" href="#start">Start a project</a>
      </div>
    </section>

    <div class="marquee" aria-hidden="true"><div class="marquee-track">{marquee}</div></div>

    <section class="block wrap" id="work" aria-labelledby="work-h">
      <div class="sec-head">
        <span class="kicker">Selected work</span>
        <h2 id="work-h">Every brand, its own world.</h2>
        <p>Each site below is hand-built from scratch — its own type, palette, motion and voice. No shared template, no page-builder. Open any one.</p>
      </div>
      <div class="grid">
{cards_html}
      </div>
    </section>

    <section class="block studio" id="studio" aria-labelledby="studio-h">
      <div class="wrap">
        <div class="sec-head">
          <span class="kicker">The studio</span>
          <h2 id="studio-h">Most gyms are sold through third-rate websites. We fix the first rep.</h2>
        </div>
        <div class="services">
          <div class="svc"><div class="svc-n">01</div><h3>Brand &amp; Identity</h3><p>A name, voice and identity that looks as strong as your training floor.</p></div>
          <div class="svc"><div class="svc-n">02</div><h3>Design &amp; Build</h3><p>Bespoke, hand-built sites — no page-builder templates. Type, motion and photography tuned per brand.</p></div>
          <div class="svc"><div class="svc-n">03</div><h3>Speed &amp; Reach</h3><p>Sub-second loads, clean SEO and mobile-first delivery — because timetables get checked on a phone.</p></div>
          <div class="svc"><div class="svc-n">04</div><h3>Bookings &amp; Growth</h3><p>Conversion-shaped journeys — free trials, class bookings and memberships, not dead ends.</p></div>
        </div>
      </div>
    </section>

    <section class="block wrap" id="offer" aria-labelledby="offer-h">
      <div class="sec-head"><span class="kicker">The numbers</span><h2 id="offer-h">Honest stats, no filler.</h2></div>
      <div class="stats">
        <div class="stat"><div class="n">{total}</div><div class="l">Fitness brands built</div></div>
        <div class="stat"><div class="n">100%</div><div class="l">Hand-built, no templates</div></div>
        <div class="stat"><div class="n">&lt;1s</div><div class="l">Median load time</div></div>
        <div class="stat"><div class="n">0</div><div class="l">Page-builders used</div></div>
      </div>
    </section>

    <section class="block wrap" id="start">
      <div class="cta">
        <h2>Let's build yours.</h2>
        <p>Have a gym or studio that deserves better than its current site? Send us where you are and where you want to take it — we reply within two days.</p>
        <div class="cta-actions">
          <a class="btn btn-solid" href="mailto:buildspacelabs@vruoom.com?subject=The%20Rep%20Studio%20%E2%80%94%20new%20project">Email the studio</a>
          <a class="btn btn-ghost" href="https://wa.me/919315776817?text=Hi%20The%20Rep%20Studio%2C%20I%27d%20like%20a%20website%20for%20my%20fitness%20brand." target="_blank" rel="noopener">WhatsApp us</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap foot">
      <div>
        <div class="foot-brand"><span class="brand-mark">{MARK_SVG}</span> The Rep Studio</div>
        <p class="foot-note">&copy; {TODAY[:4]} The Rep Studio &middot; a <a class="plain" href="https://buildspacelabs.com" target="_blank" rel="noopener" style="text-decoration:underline">BuildspaceLabs</a> atelier &middot; Made in India</p>
      </div>
      <div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap">
        <a class="plain" href="#work">Work</a>
        <a class="plain" href="#studio">Studio</a>
        <a class="plain" href="mailto:buildspacelabs@vruoom.com">Email</a>
        <a class="plain" href="https://wa.me/919315776817" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </footer>

  <script>
    (function(){{
      var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var cards=document.querySelectorAll('.card');
      if(reduce||!('IntersectionObserver' in window)){{cards.forEach(function(c){{c.classList.add('in')}});return}}
      var io=new IntersectionObserver(function(es){{es.forEach(function(e){{
        if(e.isIntersecting){{var i=Array.prototype.indexOf.call(cards,e.target);
          e.target.style.transitionDelay=(Math.min(i,8)*70)+'ms';e.target.classList.add('in');io.unobserve(e.target)}}
      }})}},{{threshold:.14}});
      cards.forEach(function(c){{io.observe(c)}});
    }})();
  </script>
</body>
</html>
"""

with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)

urls = [f"{BASE}/"]
for p in built:
    urls.append(f"{BASE}/{p['slug']}/")
    urls.append(f"{BASE}/{p['slug']}/contact.html")
sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in urls:
    pr = "1.0" if u == f"{BASE}/" else ("0.8" if u.endswith("/") else "0.5")
    sm.append(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>")
sm.append("</urlset>")
with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write("\n".join(sm) + "\n")

print(f"Hub generated: {len(built)}/{total} brands live. Cards: {len(built)}. Sitemap urls: {len(urls)}.")
