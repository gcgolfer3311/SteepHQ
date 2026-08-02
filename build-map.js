const fs = require('fs');
const { geoPath, geoEquirectangular, geoNaturalEarth1 } = require('d3-geo');
const { feature, mesh } = require('topojson-client');

const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json'));
const land = feature(world, world.objects.land);

const W = 1000, H = 600;
// Natural Earth projection looks less "boxy" than equirectangular and is what most real map sites use
const projection = geoNaturalEarth1().fitSize([W, H], land);
const path = geoPath(projection);

const landPath = path(land);

// Real region coordinates: [name, country, lon, lat, alt, harvest, note]
const REGIONS = [
  ["Darjeeling","India",88.26,27.03,"600–2,000m","Mar–Nov (4 flushes)","Muscatel-noted black tea, orthodox processed, called the 'Champagne of teas.'"],
  ["Assam","India",93.9,26.7,"45–200m","Mar–Nov","Malty, full-bodied black tea from the Brahmaputra valley; largest tea-growing region on earth."],
  ["Nilgiri","India",76.7,11.4,"1,000–2,500m","Year-round","Brisk, fragrant black tea from South India's 'Blue Mountains.'"],
  ["Uva","Sri Lanka",81.1,6.9,"1,000–1,700m","Jul–Sep (quality season)","Ceylon black tea known for a distinctive winey, menthol-like edge."],
  ["Nuwara Eliya","Sri Lanka",80.77,6.97,"1,800–2,200m","Jan–Mar","Sri Lanka's highest-grown tea; light, delicate, called 'Champagne of Ceylon.'"],
  ["Wuyi Mountains","China (Fujian)",117.9,27.7,"200–700m","Apr–May","Rock oolongs (yancha) grown in mineral-rich cliffs; home of Da Hong Pao."],
  ["Anxi","China (Fujian)",117.95,25.06,"300–1,000m","Spring & Autumn","Birthplace of Tie Guan Yin, a floral, lightly oxidized oolong."],
  ["West Lake (Hangzhou)","China (Zhejiang)",120.13,30.24,"30–300m","Late Mar–Apr","Home of Longjing (Dragon Well), China's most famous pan-fired green tea."],
  ["Yunnan","China",100.8,23.4,"1,200–2,200m","Spring & Autumn","Ancient tea-tree region; birthplace of pu-erh and large-leaf black tea (dianhong)."],
  ["Huangshan","China (Anhui)",118.17,30.13,"300–1,200m","Apr","Home of Huangshan Maofeng green tea and Keemun black tea's smoky-sweet profile."],
  ["Uji","Japan",135.8,34.9,"150–300m","May (first flush)","Japan's most prestigious tea district; shade-grown matcha and gyokuro."],
  ["Shizuoka","Japan",138.4,34.97,"Sea level–1,000m","May","Japan's largest producing region; sencha heartland."],
  ["Kagoshima","Japan",130.6,31.6,"Sea level–500m","Apr (earliest in Japan)","Volcanic soil, warm climate — Japan's earliest and fastest-growing sencha region."],
  ["Alishan","Taiwan",120.8,23.5,"1,000–1,600m","Spring & Winter","High-mountain (gaoshan) oolong prized for a creamy, floral cup."],
  ["Boseong","South Korea",127.2,34.77,"50–400m","Apr–May","Korea's largest green tea region, terraced hillsides along the coast."],
  ["Mount Kenya region","Kenya",37.3,-0.4,"1,500–2,700m","Year-round","Africa's largest producer; bright, brisk CTC black teas built for blending."],
  ["Rize","Turkey",40.5,41.0,"Sea level–500m","May–Oct","Black Sea coast; nearly all Turkish tea (world's 5th-largest producer) grows here."],
  ["Guria","Georgia",42.0,41.9,"Sea level–300m","May–Sep","Historic Soviet-era tea region seeing a modern artisanal revival."],
  ["Mộc Châu","Vietnam",104.65,20.83,"900–1,050m","Mar–Nov","Cool highland plateau producing green and increasingly specialty oolong tea."],
  ["Cameron Highlands","Malaysia",101.38,4.47,"1,300–1,800m","Year-round","Cool-climate anomaly in the tropics; British colonial-era black tea gardens."]
];

const regionsOut = REGIONS.map(([n,c,lon,lat,alt,harvest,note])=>{
  const [x,y] = projection([lon,lat]);
  return {n,c,x:+x.toFixed(1),y:+y.toFixed(1),alt,harvest,note};
});

// graticule (lat/lon grid) for realism, sparse
const graticuleLines = [];
for(let lon=-180; lon<=180; lon+=30){
  const pts = [];
  for(let lat=-80; lat<=80; lat+=5) pts.push(projection([lon,lat]));
  graticuleLines.push(pts);
}
for(let lat=-60; lat<=60; lat+=30){
  const pts = [];
  for(let lon=-180; lon<=180; lon+=5) pts.push(projection([lon,lat]));
  graticuleLines.push(pts);
}
function ptsToPath(pts){
  return pts.filter(p=>p).map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
}
const graticulePaths = graticuleLines.map(ptsToPath).join(' ');

fs.writeFileSync('map-output.json', JSON.stringify({landPath, regionsOut, graticulePaths, W, H}, null, 0));
console.log('Land path length:', landPath.length);
console.log('Regions projected:', regionsOut.length);
