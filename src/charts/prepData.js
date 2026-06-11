// Derives chart-ready datasets from the raw people.json once at module load.
// Free-text fields (title, context) are kept for tooltips, not aggregation.

const people = require('../data/people.json');

const num = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

const clean = (v) => (v == null ? '' : String(v).trim());

// --- Country names in our data → names used by world-atlas (countries-110m) ---
// Historical approximations are intentional and surfaced in the UI note.
export const COUNTRY_ALIASES = {
  'United States': 'United States of America',
  'Soviet Union': 'Russia', // mapped to modern Russia
  'West Germany': 'Germany',
};

// Microstates the 110m atlas has no polygon for — shown in the ranked list only.
export const NO_POLYGON = new Set(['Vatican City']);

// --- Honor language buckets (tells the "Man → Person" story) ---
export const HONOR_GROUPS = {
  Male: {label: 'Man / Men of the Year', color: '#3b6ea5'},
  Female: {label: 'Woman / Women of the Year', color: '#c2477f'},
  Mixed: {label: 'Man & Woman', color: '#8b5c9e'},
  Neutral: {label: 'Person / Persons of the Year', color: '#16a34a'},
  NonHuman: {label: 'Machine / Planet of the Year', color: '#6b7280'},
};

function honorGroup(honor) {
  const h = honor.toLowerCase();
  if (h.includes('machine') || h.includes('planet')) return 'NonHuman';
  const hasMan = h.includes('man') && !h.includes('woman') && !h.includes('wife');
  const hasWoman = h.includes('woman') || h.includes('women') || h.includes('wife');
  if (hasWoman && (h.includes('man and') || h.includes('and wife') || h.includes('and woman')))
    return 'Mixed';
  if (h.includes('person')) return 'Neutral';
  if (hasWoman) return 'Female';
  if (hasMan || h.includes('men')) return 'Male';
  return 'Neutral';
}

// Ordered category palette — Politics anchored on TIME red (the dominant theme).
export const CATEGORY_COLORS = {
  Politics: '#c20f16',
  War: '#18181b',
  Economics: '#2563eb',
  Diplomacy: '#0891b2',
  Revolution: '#ea580c',
  Technology: '#7c3aed',
  Space: '#0ea5e9',
  Science: '#16a34a',
  Religion: '#a16207',
  Philanthropy: '#db2777',
  Environment: '#15803d',
  Media: '#0d9488',
  Unknown: '#a1a1aa',
};

// Normalize every record once.
const records = people.map((p) => {
  const year = num(p.year);
  const birth = num(p.birth);
  return {
    name: clean(p.name),
    year,
    birth,
    death: num(p.death),
    country: clean(p.country) || 'Unknown',
    title: clean(p.title),
    category: clean(p.category) || 'Unknown',
    context: clean(p.context),
    honor: clean(p.honor),
    group: honorGroup(clean(p.honor)),
    awardAge: year != null && birth != null ? year - birth : null,
  };
});

export const allRecords = records;

// --- 1. By country (for the choropleth + ranked list) ---
export function countryData() {
  const map = new Map();
  records.forEach((r) => {
    if (r.country === 'Unknown') return;
    if (!map.has(r.country)) map.set(r.country, {country: r.country, count: 0, people: []});
    const e = map.get(r.country);
    e.count += 1;
    e.people.push({name: r.name, year: r.year, context: r.context});
  });
  const list = [...map.values()].sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  // index by atlas name for quick lookup during render
  const byAtlasName = new Map();
  list.forEach((e) => {
    const atlas = COUNTRY_ALIASES[e.country] || e.country;
    byAtlasName.set(atlas, (byAtlasName.get(atlas) || {count: 0, parts: []}));
    const slot = byAtlasName.get(atlas);
    slot.count += e.count;
    slot.parts.push(e);
  });
  return {list, byAtlasName, max: list.length ? list[0].count : 0};
}

// --- 2. Categories by decade (for the stacked area) ---
export function decadeCategoryData() {
  const cats = Object.keys(CATEGORY_COLORS).filter((c) =>
    records.some((r) => r.category === c)
  );
  const years = records.map((r) => r.year).filter((y) => y != null);
  const minDecade = Math.floor(Math.min(...years) / 10) * 10;
  const maxDecade = Math.floor(Math.max(...years) / 10) * 10;
  const rows = [];
  for (let d = minDecade; d <= maxDecade; d += 10) {
    const row = {decade: d};
    cats.forEach((c) => (row[c] = 0));
    rows.push(row);
  }
  const rowFor = (year) => rows[Math.floor(year / 10) - minDecade / 10];
  records.forEach((r) => {
    if (r.year == null) return;
    const row = rowFor(r.year);
    if (row && r.category in row) row[r.category] += 1;
  });
  // order categories by total volume (largest stacks at the bottom)
  const totals = Object.fromEntries(
    cats.map((c) => [c, rows.reduce((s, row) => s + row[c], 0)])
  );
  const ordered = [...cats].sort((a, b) => totals[b] - totals[a]);
  return {rows, categories: ordered, totals};
}

// --- 3. Honor language over time ---
export function honorTimelineData() {
  const items = records
    .filter((r) => r.year != null)
    .map((r) => ({year: r.year, name: r.name, honor: r.honor, group: r.group}))
    .sort((a, b) => a.year - b.year);
  return {items, switchYear: 1999}; // first "Person of the Year"
}

// --- 5. Repeat honorees (named more than once) ---
export function repeatHonoreesData() {
  const byName = new Map();
  records.forEach((r) => {
    if (r.year == null || !r.name) return;
    if (!byName.has(r.name))
      byName.set(r.name, {name: r.name, years: [], title: r.title, country: r.country});
    byName.get(r.name).years.push(r.year);
  });
  const repeats = [...byName.values()]
    .filter((d) => d.years.length > 1)
    .map((d) => ({...d, years: [...d.years].sort((a, b) => a - b)}))
    .sort((a, b) => b.years.length - a.years.length || a.years[0] - b.years[0]);
  const allYears = repeats.flatMap((d) => d.years);
  return {
    repeats,
    minYear: Math.min(...allYears),
    maxYear: Math.max(...allYears),
  };
}

// --- 4. Award-age beeswarm ---
export function ageData() {
  const items = records
    .filter((r) => r.awardAge != null && r.awardAge > 0)
    .map((r) => ({
      name: r.name,
      year: r.year,
      age: r.awardAge,
      group: r.group,
      title: r.title,
    }));
  return {items};
}
