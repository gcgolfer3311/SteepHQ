const fs = require('fs');
const path = require('path');

const SITE = "https://steephq.com"; // update once domain is finalized
const SITE_NAME = "SteepHQ";

const regions = JSON.parse(fs.readFileSync('data/regions.json', 'utf8'));
const teas = JSON.parse(fs.readFileSync('data/teas.json', 'utf8'));

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
footer{border-top:1px solid var(--line);padding:30px 0;text-align:center;color:var(--ink-soft);font-size:0.85rem;}
</style>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<header><div class="wrap"><a href="/" class="logo">Steep<span>HQ</span></a></div></header>
<main><div class="wrap">${bodyHtml}</div></main>
<footer><div class="wrap">© 2026 SteepHQ — the independent tea reference. <a href="/">Explore the full interactive map & encyclopedia →</a></div></footer>
</body>
</html>`;
}

const urls = [];

// ---------- Region pages ----------
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
      <a class="cta" href="/#map">Explore ${r.n} on the interactive map →</a>
    </section>
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
const COMPARISON_PAIRS = [
  ["darjeeling", "assam"],
  ["darjeeling", "nilgiri"],
  ["assam", "uva"],
  ["wuyi-mountains", "anxi"],
  ["uji", "shizuoka"],
  ["west-lake-hangzhou", "yunnan"]
];
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
      <section class="block"><h2>Contact</h2><p style="color:var(--ink-soft)">Questions about this policy: <a href="mailto:hello@steephq.com">hello@steephq.com</a></p></section>`
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
      <section class="block"><h2>Contact</h2><p style="color:var(--ink-soft)"><a href="mailto:hello@steephq.com">hello@steephq.com</a></p></section>`
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
      <section class="block"><h2>Your choices</h2><p style="color:var(--ink-soft)">You can disable cookies in your browser settings at any time. Doing so may affect some interactive features.</p></section>`
  }
];
legalPages.forEach(lp => {
  const url = `${SITE}/${lp.slug}/`;
  urls.push(url);
  const dir = path.join(OUT, lp.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title: lp.title, description: lp.description, canonical: url, bodyHtml: lp.bodyHtml }));
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

console.log(`Generated ${regions.length} region pages, ${teas.length} tea-type pages, 1 matcha landing page.`);
console.log(`Total indexed URLs: ${allUrls.length}`);
