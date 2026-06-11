import React from 'react';
import {geoNaturalEarth1, geoPath, geoGraticule10} from 'd3-geo';
import {scaleThreshold} from 'd3-scale';
import {feature} from 'topojson-client';
import topo from 'world-atlas/countries-110m.json';
import {countryData, NO_POLYGON} from './prepData';
import {useTooltip, Tooltip} from './Tooltip';
import CollapsibleCard from './CollapsibleCard';

const W = 660;
const H = 360;

const land = feature(topo, topo.objects.countries);
const projection = geoNaturalEarth1().fitSize([W, H], land);
const path = geoPath(projection);
const graticule = geoGraticule10();

// 5 buckets, light → TIME red. US (64) lands in the top bucket.
const BUCKETS = [
  {min: 1, max: 1, color: '#fbd5d6', label: '1'},
  {min: 2, max: 3, color: '#f3a3a6', label: '2–3'},
  {min: 4, max: 6, color: '#e85d62', label: '4–6'},
  {min: 7, max: 15, color: '#d12027', label: '7–15'},
  {min: 16, max: Infinity, color: '#c20f16', label: '16+'},
];
const color = scaleThreshold()
  .domain([2, 4, 7, 16])
  .range(BUCKETS.map((b) => b.color));

const {list, byAtlasName} = countryData();

export default function WorldMap() {
  const {tip, show, hide} = useTooltip();

  const tipFor = (atlasName, slot) => (
    <span>
      <strong>{slot.parts.map((p) => p.country).join(' / ')}</strong>
      <br />
      {slot.count} {slot.count === 1 ? 'honoree' : 'honorees'}
      <br />
      <span className="muted">
        {slot.parts
          .flatMap((p) => p.people)
          .slice(0, 4)
          .map((pe) => `${pe.name} (${pe.year})`)
          .join(', ')}
        {slot.parts.flatMap((p) => p.people).length > 4 ? '…' : ''}
      </span>
    </span>
  );

  return (
    <CollapsibleCard
      className="span-2"
      title="Where honorees come from"
      sub={
        <>
          TIME’s Person of the Year is overwhelmingly American. Shading shows how many
          honorees each country has produced; hover for names.
        </>
      }
      note={
        <>
          Historical mapping: Soviet Union shown as Russia; West Germany merged into Germany.
          * Microstates (e.g. Vatican City) appear in the list but are too small to shade on the map.
        </>
      }
    >
      <div className="map-layout">
        <div className="map-figure" style={{position: 'relative'}}>
          <svg
            className="viz-svg"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="World map shaded by number of TIME Person of the Year honorees per country. The United States leads with the most honorees."
          >
            <rect x="0" y="0" width={W} height={H} className="geo-sea" rx="6" />
            <path className="geo-graticule" d={path(graticule)} />
            {land.features.map((f) => {
              const slot = byAtlasName.get(f.properties.name);
              const hasData = !!slot;
              return (
                <path
                  key={f.id || f.properties.name}
                  className={`geo-country${hasData ? ' has-data' : ''}`}
                  d={path(f)}
                  fill={hasData ? color(slot.count) : '#e9ecef'}
                  onMouseEnter={hasData ? (e) => show(e, tipFor(f.properties.name, slot)) : undefined}
                  onMouseMove={hasData ? (e) => show(e, tipFor(f.properties.name, slot)) : undefined}
                  onMouseLeave={hasData ? hide : undefined}
                />
              );
            })}
          </svg>
          <Tooltip tip={tip} />

          <div className="legend" aria-hidden="true">
            {BUCKETS.map((b) => (
              <span key={b.label} style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                <span className="swatch" style={{background: b.color}} />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        <div className="map-aside">
          <h4 className="map-aside__title">Most honored countries</h4>
          <ol className="country-list">
            {list.slice(0, 12).map((c) => (
              <li key={c.country}>
                <span>
                  {c.country}
                  {NO_POLYGON.has(c.country) ? ' *' : ''}
                </span>
                <span className="ct">{c.count}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </CollapsibleCard>
  );
}
