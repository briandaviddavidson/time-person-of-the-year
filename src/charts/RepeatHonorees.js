import React from 'react';
import {scaleLinear} from 'd3-scale';
import {repeatHonoreesData} from './prepData';
import {useTooltip, Tooltip} from './Tooltip';
import CollapsibleCard from './CollapsibleCard';

const W = 640;
const ROW = 20;
const M = {top: 30, right: 22, bottom: 20, left: 168};

const {repeats, minYear, maxYear} = repeatHonoreesData();
const H = M.top + repeats.length * ROW + M.bottom;

const decadeTicks = [];
for (let d = Math.ceil(minYear / 10) * 10; d <= maxYear; d += 10) decadeTicks.push(d);

export default function RepeatHonorees() {
  const {tip, show, hide} = useTooltip();

  const x = scaleLinear().domain([minYear, maxYear]).range([M.left, W - M.right]).nice();
  const plotBottom = M.top + repeats.length * ROW;

  const tipFor = (d, yr) => (
    <span>
      <strong>{d.name}</strong>, {yr}
      <br />
      <span className="muted">
        {d.title ? `${d.title} · ` : ''}honored {d.years.length}×
      </span>
    </span>
  );

  return (
    <CollapsibleCard
      title="Honored more than once"
      sub={
        <>
          Fourteen honorees earned the title twice — only Franklin D. Roosevelt did it three
          times. Each dot is a year they were named; the line spans their first to last.
        </>
      }
    >
      <div style={{position: 'relative'}}>
        <svg
          className="viz-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Repeat TIME honorees from ${minYear} to ${maxYear}. Franklin D. Roosevelt was named three times; thirteen others were named twice.`}
        >
          {/* decade gridlines + labels along the top */}
          {decadeTicks.map((t) => (
            <g key={t} className="tick" transform={`translate(${x(t)},${M.top})`}>
              <line y1={0} y2={plotBottom - M.top} />
              <text y={-8} textAnchor="middle">{t}</text>
            </g>
          ))}

          {repeats.map((d, i) => {
            const cy = M.top + i * ROW + ROW / 2;
            return (
              <g key={d.name}>
                <text className="repeat-name" x={M.left - 14} y={cy} dy="0.32em" textAnchor="end">
                  {d.name}
                </text>
                <line
                  className="repeat-span"
                  x1={x(d.years[0])}
                  x2={x(d.years[d.years.length - 1])}
                  y1={cy}
                  y2={cy}
                />
                {d.years.map((yr) => (
                  <circle
                    key={yr}
                    className="repeat-dot"
                    cx={x(yr)}
                    cy={cy}
                    r={4.5}
                    onMouseEnter={(e) => show(e, tipFor(d, yr))}
                    onMouseMove={(e) => show(e, tipFor(d, yr))}
                    onMouseLeave={hide}
                  />
                ))}
              </g>
            );
          })}
        </svg>
        <Tooltip tip={tip} />
      </div>
    </CollapsibleCard>
  );
}
