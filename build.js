const fs = require('fs');
const path = require('path');

const SITE = "https://steephq.com"; // update once domain is finalized
const SITE_NAME = "SteepHQ";

const regions = JSON.parse(fs.readFileSync('data/regions.json', 'utf8'));
const teas = JSON.parse(fs.readFileSync('data/teas.json', 'utf8'));
const glossary = JSON.parse(fs.readFileSync('data/glossary.json', 'utf8'));
const journal = JSON.parse(fs.readFileSync('data/journal.json', 'utf8'));
function slugifyTerm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const OUT = 'dist';
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// Copy the main SPA as the homepage
fs.copyFileSync('index.html', path.join(OUT, 'index.html'));

function page({ title, description, canonical, bodyHtml, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<link rel="icon" type="image/svg+xml" href="${SITE}/favicon.svg">
<link rel="alternate" type="application/rss+xml" title="SteepHQ Updates" href="${SITE}/rss.xml">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--jade:#7A9B76;--jade-pale:#E7EEE3;--oolong:#B8763E;--puerh:#4A342A;--porcelain:#FAF7F2;--ink:#242120;--ink-soft:#5C5652;--line:#E3DDD3;--gold:#C9A15A;--font-display:'Fraunces',serif;--font-body:'Inter',sans-serif;--font-mono:'JetBrains Mono',monospace;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:var(--font-body);color:var(--ink);background:var(--porcelain);line-height:1.6;-webkit-font-smoothing:antialiased;}
a{color:var(--jade);text-decoration:none;font-weight:600;}
a:hover{text-decoration:underline;}
.wrap{max-width:760px;margin:0 auto;padding:0 24px;}
header{padding:20px 0;border-bottom:1px solid var(--line);}
.logo{font-family:var(--font-display);font-weight:600;font-size:1.3rem;}
.logo span{color:var(--oolong);}
main{padding:56px 0 80px;}
.eyebrow{font-family:var(--font-mono);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--oolong);font-weight:500;margin-bottom:14px;}
h1{font-family:var(--font-display);font-size:clamp(2rem,4vw,2.8rem);font-weight:600;letter-spacing:-0.02em;margin-bottom:18px;line-height:1.1;}
.lede{font-size:1.1rem;color:var(--ink-soft);margin-bottom:34px;}
.stat-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:34px;}
.stat{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 18px;}
.stat .k{font-family:var(--font-mono);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--jade);font-weight:600;}
.stat .v{font-size:1rem;font-weight:600;margin-top:2px;}
section.block{margin-bottom:34px;}
h2{font-family:var(--font-display);font-size:1.4rem;font-weight:600;margin-bottom:12px;}
ul{padding-left:20px;color:var(--ink-soft);}
li{margin-bottom:8px;}
.cta{display:inline-block;margin-top:8px;background:var(--ink);color:#fff !important;padding:13px 26px;border-radius:30px;font-weight:600;text-decoration:none !important;}
.related{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;}
.related a{background:var(--jade-pale);padding:8px 14px;border-radius:20px;font-size:0.85rem;font-weight:500;}
.share-row{display:flex; gap:10px; align-items:center; margin:36px 0 0; padding-top:24px; border-top:1px solid var(--line);}
.share-row span{font-family:var(--font-mono); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ink-soft);}
.share-row a{background:var(--jade-pale); width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85rem; text-decoration:none !important;}
footer{border-top:1px solid var(--line);padding:30px 0;text-align:center;color:var(--ink-soft);font-size:0.85rem;}
</style>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<header><div class="wrap"><a href="/" class="logo">Steep<span>HQ</span></a></div></header>
<main><div class="wrap">${bodyHtml}
  <div class="share-row">
    <span>Share</span>
    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener" aria-label="Share on X">𝕏</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}" target="_blank" rel="noopener" aria-label="Share on Facebook">f</a>
    <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(canonical)}" aria-label="Share by email">✉</a>
  </div>
</div></main>
<footer><div class="wrap">© 2026 SteepHQ — the independent tea reference. <a href="/">Explore the full interactive map & encyclopedia →</a></div></footer>
</body>
</html>`;
}

const urls = [];

// ---------- Region pages ----------
const COMPARISON_PAIRS = [
  ["darjeeling", "assam"],
  ["darjeeling", "nilgiri"],
  ["assam", "uva"],
  ["wuyi-mountains", "anxi"],
  ["uji", "shizuoka"],
  ["west-lake-hangzhou", "yunnan"]
];
function comparisonsFor(slug) {
  return COMPARISON_PAIRS.filter(pair => pair.includes(slug));
}
// Match a region's descriptive note to the tea-type pages it's relevant to, for internal linking.
// Keyword-based on the region's own stated note — no invented facts, just cross-referencing existing content.
const TEA_KEYWORDS = {
  "white-tea": ["white tea"],
  "green-tea": ["green tea"],
  "yellow-tea": ["yellow tea"],
  "oolong-tea": ["oolong"],
  "black-tea": ["black tea"],
  "puerh-dark-tea": ["pu-erh", "puerh", "dark tea"]
};
function teaTypesFor(note) {
  const lower = note.toLowerCase();
  return teas.filter(t => (TEA_KEYWORDS[t.slug] || []).some(kw => lower.includes(kw)));
}

const regionsDir = path.join(OUT, 'tea-regions');
fs.mkdirSync(regionsDir, { recursive: true });
regions.forEach(r => {
  const url = `${SITE}/tea-regions/${r.slug}/`;
  urls.push(url);
  const dir = path.join(regionsDir, r.slug);
  fs.mkdirSync(dir, { recursive: true });
  const title = `${r.n} Tea Region Guide — Altitude, Harvest, Notable Teas | SteepHQ`;
  const description = `${r.n}, ${r.c}: growing altitude ${r.alt}, harvest season ${r.harvest}. ${r.note}`.slice(0, 158);
  const otherRegions = regions.filter(x => x.slug !== r.slug).slice(0, 6);
  const relatedTeaTypes = teaTypesFor(r.note);
  const relatedComparisons = comparisonsFor(r.slug);
  const isHighAltitude = /[2-9],\d{3}m|1,[5-9]\d\dm/.test(r.alt);
  const bodyHtml = `
    <div class="eyebrow">Tea Region Guide</div>
    <h1>${r.n}, ${r.c}</h1>
    <p class="lede">${r.note}</p>
    <div class="stat-row">
      <div class="stat"><div class="k">Altitude</div><div class="v">${r.alt}</div></div>
      <div class="stat"><div class="k">Harvest window</div><div class="v">${r.harvest}</div></div>
      <div class="stat"><div class="k">Country</div><div class="v">${r.c}</div></div>
    </div>
    <section class="block">
      <h2>Why ${r.n} tastes the way it does</h2>
      <p style="color:var(--ink-soft)">${r.note} Altitude, soil, and harvest timing all shape the cup — see it plotted on our full interactive world map for context against every other growing region.</p>
      ${isHighAltitude ? `<p style="color:var(--ink-soft)">At this altitude, cooler temperatures slow the tea plant's growth. Slower growth generally concentrates more flavor and aromatic compounds in each leaf — a big part of why high-grown teas are often prized over lowland-grown leaf of the same type.</p>` : ''}
      <a class="cta" href="/#map">Explore ${r.n} on the interactive map →</a>
    </section>
    ${relatedTeaTypes.length ? `
    <section class="block">
      <h2>Tea types grown here</h2>
      <div class="related">
        ${relatedTeaTypes.map(t => `<a href="${SITE}/learn/${t.slug}/">${t.n}</a>`).join('')}
      </div>
    </section>` : ''}
    ${relatedComparisons.length ? `
    <section class="block">
      <h2>See how it compares</h2>
      <div class="related">
        ${relatedComparisons.map(([a,b]) => `<a href="${SITE}/compare/${a}-vs-${b}/">${regions.find(x=>x.slug===a).n} vs ${regions.find(x=>x.slug===b).n}</a>`).join('')}
      </div>
    </section>` : ''}
    <section class="block">
      <h2>Other regions to know</h2>
      <div class="related">
        ${otherRegions.map(o => `<a href="${SITE}/tea-regions/${o.slug}/">${o.n}, ${o.c}</a>`).join('')}
      </div>
    </section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${r.n}, ${r.c}`,
    "description": description,
    "url": url
  };
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
});

// ---------- Tea type / encyclopedia pages ----------
const learnDir = path.join(OUT, 'learn');
fs.mkdirSync(learnDir, { recursive: true });
teas.forEach(t => {
  const url = `${SITE}/learn/${t.slug}/`;
  urls.push(url);
  const dir = path.join(learnDir, t.slug);
  fs.mkdirSync(dir, { recursive: true });
  const title = `${t.n}: How It's Made, Brewing Guide & Teas to Know | SteepHQ`;
  const description = `${t.n} (${t.oxid}): ${t.desc}`.slice(0, 158);
  const otherTeas = teas.filter(x => x.slug !== t.slug);
  const bodyHtml = `
    <div class="eyebrow">${t.oxid}</div>
    <h1>${t.n}</h1>
    <p class="lede">${t.desc}</p>
    <section class="block">
      <h2>How it's processed</h2>
      <ul>${t.process.map(p => `<li>${p}</li>`).join('')}</ul>
    </section>
    <section class="block">
      <h2>Teas to know</h2>
      <ul>${t.known.map(k => `<li>${k}</li>`).join('')}</ul>
    </section>
    <section class="block">
      <h2>How to brew it</h2>
      <p style="font-family:var(--font-mono); color:var(--ink);">${t.brew}</p>
      <a class="cta" href="/#reviews">See independent ${t.n} reviews →</a>
    </section>
    <section class="block">
      <h2>Other tea types</h2>
      <div class="related">
        ${otherTeas.map(o => `<a href="${SITE}/learn/${o.slug}/">${o.n}</a>`).join('')}
      </div>
    </section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url
  };
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
});

// ---------- Matcha authenticity landing page (SEO-targeted, links to the interactive tool) ----------
const matchaDir = path.join(OUT, 'is-my-matcha-real');
fs.mkdirSync(matchaDir, { recursive: true });
{
  const url = `${SITE}/is-my-matcha-real/`;
  urls.push(url);
  const title = `Is My Matcha Real? Free Ceremonial Grade Authenticity Checker | SteepHQ`;
  const description = `The 2026 tencha shortage has driven a wave of relabeled and counterfeit "ceremonial grade" matcha. Answer 5 quick questions to check yours — free, no signup.`;
  const bodyHtml = `
    <div class="eyebrow">Free tool · 2026 shortage guide</div>
    <h1>Is your matcha actually ceremonial grade?</h1>
    <p class="lede">A genuine tencha shortage has squeezed Japan's supply since late 2024, with wholesale prices still running 30–60% above pre-2025 levels through 2026. When authentic supply runs short, relabeled sencha powder, aged stock, and non-Japanese matcha sold as "ceremonial" fill the gap.</p>
    <section class="block">
      <h2>The 5 checks that matter</h2>
      <ul>
        <li><b>Price</b> — genuine ceremonial tencha has a real production floor; prices well under that are a red flag</li>
        <li><b>Named origin</b> — Uji, Nishio, Yame, and Kagoshima are the regions to look for, ideally with a named farm</li>
        <li><b>Color</b> — vivid, almost neon jade green; dull olive suggests older or lower-grade leaf</li>
        <li><b>Harvest date</b> — a stated current-year first-flush harvest, not just a generic best-by date</li>
        <li><b>Texture</b> — genuine ceremonial matcha is stone-ground to a silky, powder-fine texture</li>
      </ul>
      <a class="cta" href="/#matcha">Run the full interactive checker →</a>
    </section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How can I tell if my matcha is really ceremonial grade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check the price against current wholesale floors, look for a named growing region (Uji, Nishio, Yame, Kagoshima), check for vivid green color and silky texture, and look for a stated current-year harvest date."
      }
    }]
  };
  fs.writeFileSync(path.join(matchaDir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
}

// ---------- Comparison pages (region vs region, high commercial-intent search terms) ----------
const compareDir = path.join(OUT, 'compare');
fs.mkdirSync(compareDir, { recursive: true });
function findRegion(slug) {
  return regions.find(r => r.slug === slug);
}
COMPARISON_PAIRS.forEach(([slugA, slugB]) => {
  const a = findRegion(slugA), b = findRegion(slugB);
  if (!a || !b) return; // skip pairs where a slug doesn't match generated data
  const cslug = `${a.slug}-vs-${b.slug}`;
  const url = `${SITE}/compare/${cslug}/`;
  urls.push(url);
  const dir = path.join(compareDir, cslug);
  fs.mkdirSync(dir, { recursive: true });
  const title = `${a.n} vs ${b.n}: Tea Region Comparison | SteepHQ`;
  const description = `${a.n} (${a.c}) vs ${b.n} (${b.c}): altitude, harvest season, and flavor differences compared side by side.`;
  const bodyHtml = `
    <div class="eyebrow">Region Comparison</div>
    <h1>${a.n} vs ${b.n}</h1>
    <p class="lede">Two distinct growing regions, two different cups. Here's how they actually compare.</p>
    <section class="block">
      <h2>${a.n}, ${a.c}</h2>
      <div class="stat-row">
        <div class="stat"><div class="k">Altitude</div><div class="v">${a.alt}</div></div>
        <div class="stat"><div class="k">Harvest</div><div class="v">${a.harvest}</div></div>
      </div>
      <p style="color:var(--ink-soft)">${a.note}</p>
    </section>
    <section class="block">
      <h2>${b.n}, ${b.c}</h2>
      <div class="stat-row">
        <div class="stat"><div class="k">Altitude</div><div class="v">${b.alt}</div></div>
        <div class="stat"><div class="k">Harvest</div><div class="v">${b.harvest}</div></div>
      </div>
      <p style="color:var(--ink-soft)">${b.note}</p>
    </section>
    <section class="block">
      <h2>The short version</h2>
      <p style="color:var(--ink-soft)">Both are worth trying rather than choosing between — see them side by side on the interactive map, along with 48 other growing regions, for the full picture.</p>
      <a class="cta" href="/#map">Compare on the interactive map →</a>
    </section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url
  };
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
});

// ---------- Legal pages ----------
const legalPages = [
  {
    slug: "privacy",
    title: "Privacy Policy | SteepHQ",
    description: "How SteepHQ collects, uses, and protects your information.",
    bodyHtml: `
      <div class="eyebrow">Legal</div>
      <h1>Privacy Policy</h1>
      <p class="lede">Last updated: July 2026</p>
      <section class="block"><h2>What we collect</h2><p style="color:var(--ink-soft)">If you subscribe to our newsletter, we collect your email address. If you use the interactive tools on this site (region map, matcha checker, steep timer), your answers and clicks stay in your browser and are not sent to our servers.</p></section>
      <section class="block"><h2>Cookies</h2><p style="color:var(--ink-soft)">We use minimal cookies for basic site functionality and, if enabled, privacy-respecting analytics to understand which pages are useful. We do not sell your data to third parties.</p></section>
      <section class="block"><h2>Affiliate links</h2><p style="color:var(--ink-soft)">Some links on this site are affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you. See our <a href="/">disclosure notices</a> on relevant pages for details.</p></section>
      <section class="block"><h2>Contact</h2><p style="color:var(--ink-soft)">Questions about this policy: <a href="mailto:steephq3311@gmail.com">steephq3311@gmail.com</a></p></section>`
  },
  {
    slug: "terms",
    title: "Terms of Use | SteepHQ",
    description: "Terms and conditions for using the SteepHQ website.",
    bodyHtml: `
      <div class="eyebrow">Legal</div>
      <h1>Terms of Use</h1>
      <p class="lede">Last updated: July 2026</p>
      <section class="block"><h2>Content</h2><p style="color:var(--ink-soft)">SteepHQ provides educational content about tea regions, processing, and independent reviews. Content is for general informational purposes and is not professional, medical, or investment advice.</p></section>
      <section class="block"><h2>Reviews</h2><p style="color:var(--ink-soft)">Reviews reflect the honest opinion of the reviewer at time of writing, based on tea purchased at retail price unless otherwise disclosed. Scores are not influenced by affiliate relationships.</p></section>
      <section class="block"><h2>Liability</h2><p style="color:var(--ink-soft)">SteepHQ is provided "as is" without warranties of any kind. We are not liable for purchasing decisions made based on site content.</p></section>
      <section class="block"><h2>Contact</h2><p style="color:var(--ink-soft)">Questions, corrections, or feedback on anything here: <a href="mailto:steephq3311@gmail.com">steephq3311@gmail.com</a> — a real person reads and answers every email.</p></section>`
  },
  {
    slug: "cookies",
    title: "Cookie Notice | SteepHQ",
    description: "How SteepHQ uses cookies.",
    bodyHtml: `
      <div class="eyebrow">Legal</div>
      <h1>Cookie Notice</h1>
      <p class="lede">Last updated: July 2026</p>
      <section class="block"><h2>What we use cookies for</h2><p style="color:var(--ink-soft)">Essential cookies for site functionality, and optionally, privacy-respecting analytics to understand traffic patterns. We do not use cookies for cross-site ad tracking.</p></section>
      <section class="block"><h2>Your choices</h2><p style="color:var(--ink-soft)">You can disable cookies in your browser settings at any time. Doing so may affect some interactive features.</p></section>
      <section class="block"><h2>Contact</h2><p style="color:var(--ink-soft)">Questions about this policy: <a href="mailto:steephq3311@gmail.com">steephq3311@gmail.com</a></p></section>`
  }
];
legalPages.forEach(lp => {
  const url = `${SITE}/${lp.slug}/`;
  urls.push(url);
  const dir = path.join(OUT, lp.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title: lp.title, description: lp.description, canonical: url, bodyHtml: lp.bodyHtml }));
});

// ---------- Glossary index + individual term pages ----------
const glossaryDir = path.join(OUT, 'glossary');
fs.mkdirSync(glossaryDir, { recursive: true });
{
  const url = `${SITE}/glossary/`;
  urls.push(url);
  const cats = [...new Set(glossary.map(g => g.cat))].sort();
  const title = `Tea Glossary — ${glossary.length} Tea Terms Explained | SteepHQ`;
  const description = `Plain-English definitions for ${glossary.length} tea terms, from oxidation and gongfu to tencha, huigan, and yancha.`;
  const bodyHtml = `
    <div class="eyebrow">Reference</div>
    <h1>Tea Glossary</h1>
    <p class="lede">Every term you'll run into on a tea label or in a tasting note, explained without jargon. ${glossary.length} entries.</p>
    ${cats.map(c => `
    <section class="block">
      <h2>${c}</h2>
      <div class="related">
        ${glossary.filter(g => g.cat === c).map(g => `<a href="${SITE}/glossary/${slugifyTerm(g.term)}/">${g.term}</a>`).join('')}
      </div>
    </section>`).join('')}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "SteepHQ Tea Glossary",
    "description": description,
    "url": url
  };
  fs.writeFileSync(path.join(glossaryDir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
}
glossary.forEach(g => {
  const gslug = slugifyTerm(g.term);
  const url = `${SITE}/glossary/${gslug}/`;
  urls.push(url);
  const dir = path.join(glossaryDir, gslug);
  fs.mkdirSync(dir, { recursive: true });
  const title = `${g.term} — What It Means in Tea | SteepHQ`;
  const description = g.def.slice(0, 158);
  const related = glossary.filter(x => x.cat === g.cat && x.term !== g.term).slice(0, 6);
  const bodyHtml = `
    <div class="eyebrow">Glossary · ${g.cat}</div>
    <h1>${g.term}</h1>
    <p class="lede">${g.def}</p>
    ${g.also ? `<section class="block"><h2>Worth knowing</h2><p style="color:var(--ink-soft)">${g.also}</p></section>` : ''}
    <section class="block">
      <h2>Related terms</h2>
      <div class="related">
        ${related.map(r => `<a href="${SITE}/glossary/${slugifyTerm(r.term)}/">${r.term}</a>`).join('')}
      </div>
      <a class="cta" href="${SITE}/glossary/">See the full tea glossary →</a>
    </section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": g.term,
    "description": g.def,
    "inDefinedTermSet": `${SITE}/glossary/`,
    "url": url
  };
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
});

// ---------- Journal index + article pages ----------
const journalDir = path.join(OUT, 'journal');
fs.mkdirSync(journalDir, { recursive: true });
{
  const url = `${SITE}/journal/`;
  urls.push(url);
  const title = `Journal — Tea Analysis & Reporting | SteepHQ`;
  const description = `In-depth tea reporting and analysis from SteepHQ — supply, sourcing, authenticity, and what's actually happening in the tea trade.`;
  const bodyHtml = `
    <div class="eyebrow">Journal</div>
    <h1>Tea, reported properly</h1>
    <p class="lede">Analysis and reporting on what's actually happening in tea — supply, sourcing, labeling, and the stories behind what ends up in your cup.</p>
    ${journal.map(a => `
    <section class="block">
      <h2><a href="${SITE}/journal/${a.slug}/">${a.title}</a></h2>
      <p style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-soft);">${a.dateDisplay} · ${a.author}</p>
      <p style="color:var(--ink-soft)">${a.excerpt}</p>
      <a class="cta" href="${SITE}/journal/${a.slug}/">Read it →</a>
    </section>`).join('')}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "SteepHQ Journal",
    "description": description,
    "url": url
  };
  fs.writeFileSync(path.join(journalDir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
}
journal.forEach(a => {
  const url = `${SITE}/journal/${a.slug}/`;
  urls.push(url);
  const dir = path.join(journalDir, a.slug);
  fs.mkdirSync(dir, { recursive: true });
  const title = `${a.title} | SteepHQ`;
  const description = a.excerpt.slice(0, 158);
  const bodyHtml = `
    <div class="eyebrow">Journal · ${a.dateDisplay}</div>
    <h1>${a.title}</h1>
    <p class="lede">${a.excerpt}</p>
    <p style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-soft); margin-bottom:28px;">By ${a.author} · Published ${a.dateDisplay}</p>
    ${a.sections.map(s => `<section class="block"><h2>${s.h}</h2><p style="color:var(--ink-soft)">${s.p}</p></section>`).join('')}
    <section class="block">
      <h2>Check your own matcha</h2>
      <p style="color:var(--ink-soft)">We built a free tool that walks through the checks described above.</p>
      <a class="cta" href="/#matcha">Run the matcha authenticity checker →</a>
    </section>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": a.title,
    "description": description,
    "datePublished": a.date,
    "author": { "@type": "Person", "name": a.author },
    "publisher": { "@type": "Organization", "name": "SteepHQ" },
    "url": url
  };
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title, description, canonical: url, bodyHtml, jsonLd }));
});

// ---------- sitemap.xml ----------
const allUrls = [`${SITE}/`, ...urls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);

// ---------- robots.txt ----------
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// ---------- favicon ----------
if (fs.existsSync('favicon.svg')) fs.copyFileSync('favicon.svg', path.join(OUT, 'favicon.svg'));

// ---------- 404 page ----------
{
  const title = "Page Not Found | SteepHQ";
  const description = "This page doesn't exist — but the tea region or type you're looking for might. Try the full map or encyclopedia.";
  const bodyHtml = `
    <div class="eyebrow">404</div>
    <h1>That page steeped away.</h1>
    <p class="lede">We couldn't find what you were looking for. Try the interactive map, the tea encyclopedia, or head back to the homepage.</p>
    <a class="cta" href="/">Back to SteepHQ →</a>`;
  fs.writeFileSync(path.join(OUT, '404.html'), page({ title, description, canonical: `${SITE}/404.html`, bodyHtml }));
}

// ---------- rss.xml ----------
// Static snapshot of current content. Re-running build.js after adding genuinely new
// content (new regions, new reviews, a future journal section) will refresh this feed
// automatically since it's generated from the same data at every build.
{
  const now = new Date().toUTCString();
  const items = [
    ...journal.map(a => ({
      title: a.title,
      link: `${SITE}/journal/${a.slug}/`,
      description: a.excerpt
    })),
    ...regions.map(r => ({
      title: `${r.n} Tea Region Guide`,
      link: `${SITE}/tea-regions/${r.slug}/`,
      description: r.note
    })),
    ...teas.map(t => ({
      title: `${t.n}: How It's Made & Brewed`,
      link: `${SITE}/learn/${t.slug}/`,
      description: t.desc
    })),
    {
      title: "Is My Matcha Real? Free Authenticity Checker",
      link: `${SITE}/is-my-matcha-real/`,
      description: "A free tool to check your ceremonial-grade matcha against common signs of mislabeling during the 2026 tencha shortage."
    }
  ];
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>SteepHQ — Tea Regions, Types &amp; Reviews</title>
  <link>${SITE}/</link>
  <description>The independent reference for tea regions, processing, and honest reviews.</description>
  <lastBuildDate>${now}</lastBuildDate>
  ${items.map(i => `<item>
    <title>${i.title.replace(/&/g,'&amp;')}</title>
    <link>${i.link}</link>
    <description>${i.description.replace(/&/g,'&amp;')}</description>
    <guid>${i.link}</guid>
  </item>`).join('\n  ')}
</channel>
</rss>`;
  fs.writeFileSync(path.join(OUT, 'rss.xml'), rss);
}

console.log(`Generated ${regions.length} region pages, ${teas.length} tea-type pages, 1 matcha landing page.`);
console.log(`Generated ${glossary.length} glossary term pages + glossary index.`);
console.log(`Generated ${journal.length} journal article page(s) + journal index.`);
console.log(`Total indexed URLs: ${allUrls.length}`);
console.log(`Generated 404.html, rss.xml, favicon.svg`);
