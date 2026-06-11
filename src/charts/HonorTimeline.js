import React from 'react';
import {scaleLinear} from 'd3-scale';
import {honorTimelineData, HONOR_GROUPS} from './prepData';
import {useTooltip, Tooltip} from './Tooltip';
import CollapsibleCard from './CollapsibleCard';

const W = 640;
const M = {top: 16, right: 14, bottom: 30, left: 14};
const CELL = 6; // square size
const GAP = 1.5;

const {items, switchYear} = honorTimelineData();
const minYear = Math.min(...items.map((d) => d.year));
const maxYear = Math.max(...items.map((d) => d.year));

// stack entries that share a year (build upward from the baseline)
const seen = {};
const placed = items.map((d) => {
  const idx = seen[d.year] || 0;
  seen[d.year] = idx + 1;
  return {...d, stackIdx: idx};
});
const maxStack = Math.max(...Object.values(seen));
const plotH = maxStack * (CELL + GAP);
const H = M.top + plotH + M.bottom;

export default function HonorTimeline() {
  const {tip, show, hide} = useTooltip();
  const x = scaleLinear().domain([minYear, maxYear + 1]).range([M.left, W - M.right]);
  const baseY = M.top + plotH;
  const switchX = x(switchYear);

  return (
    <CollapsibleCard
      title="From “Man” to “Person” of the Year"
      sub={
        <>
          Each square is one honoree, placed by year and colored by the language TIME used.
          The title went gender-neutral in {switchYear}.
        </>
      }
    >
      <div style={{position: 'relative'}}>
        <svg className="viz-svg" viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={`Timeline from ${minYear} to ${maxYear}. Honorees were titled "Man of the Year" through the 20th century; TIME switched to the gender-neutral "Person of the Year" in ${switchYear}.`}>
          {/* decade ticks */}
          {Array.from({length: Math.floor((maxYear - minYear) / 10) + 1}, (_, i) => minYear - (minYear % 10) + i * 10)
            .filter((yr) => yr >= minYear)
            .map((yr) => (
              <g key={yr} className="tick" transform={`translate(${x(yr)},${baseY + 6})`}>
                <text y="12" textAnchor="middle">{yr}</text>
              </g>
            ))}

          {/* 1999 switch marker */}
          <line className="annotation-line" x1={switchX} x2={switchX} y1={M.top - 4} y2={baseY + 2} />
          <text className="annotation" x={switchX + 4} y={M.top + 4}>
            {switchYear}: “Person”
          </text>

          {placed.map((d, i) => (
            <rect
              key={i}
              x={x(d.year)}
              y={baseY - (d.stackIdx + 1) * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx="1.5"
              fill={HONOR_GROUPS[d.group].color}
              onMouseEnter={(e) =>
                show(e, (
                  <span>
                    <strong>{d.name}</strong>
                    <br />
                    {d.honor} · {d.year}
                  </span>
                ))
              }
              onMouseMove={(e) =>
                show(e, (
                  <span>
                    <strong>{d.name}</strong>
                    <br />
                    {d.honor} · {d.year}
                  </span>
                ))
              }
              onMouseLeave={hide}
            />
          ))}
        </svg>
        <Tooltip tip={tip} />
      </div>

      <div className="legend" aria-hidden="true">
        {Object.values(HONOR_GROUPS).map((g) => (
          <span key={g.label} style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
            <span className="swatch" style={{background: g.color}} />
            {g.label}
          </span>
        ))}
      </div>
    </CollapsibleCard>
  );
}
