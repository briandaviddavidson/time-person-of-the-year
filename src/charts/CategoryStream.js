import React from 'react';
import {scaleLinear} from 'd3-scale';
import {stack, area, curveCatmullRom} from 'd3-shape';
import {max} from 'd3-array';
import {decadeCategoryData, CATEGORY_COLORS} from './prepData';
import {useTooltip, Tooltip} from './Tooltip';
import CollapsibleCard from './CollapsibleCard';

const W = 640;
const H = 340;
const M = {top: 16, right: 16, bottom: 34, left: 32};

const {rows, categories, totals} = decadeCategoryData();
const decades = rows.map((r) => r.decade);

export default function CategoryStream() {
  const {tip, show, hide} = useTooltip();
  const [off, setOff] = React.useState(() => new Set());

  const active = categories.filter((c) => !off.has(c));

  const {series, yMax} = React.useMemo(() => {
    const s = stack().keys(active)(rows);
    const ym = max(s, (layer) => max(layer, (d) => d[1])) || 1;
    return {series: s, yMax: ym};
  }, [active]);

  const x = scaleLinear()
    .domain([decades[0], decades[decades.length - 1]])
    .range([M.left, W - M.right]);
  const y = scaleLinear().domain([0, yMax]).nice().range([H - M.bottom, M.top]);

  const areaGen = area()
    .x((d) => x(d.data.decade))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveCatmullRom.alpha(0.5));

  const toggle = (c) =>
    setOff((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  return (
    <CollapsibleCard
      title="What the world cared about"
      sub={
        <>
          Honorees by theme across the decades. War surges in the 1940s; Space arrives in the
          1960s; Technology and the environment rise late. Toggle a theme in the legend.
        </>
      }
    >
      <div style={{position: 'relative'}}>
        <svg className="viz-svg" viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label="Stacked area chart of TIME honorees by theme across decades. Politics and War are the largest themes overall.">
          {/* y grid + ticks */}
          {y.ticks(5).map((t) => (
            <g key={t} className="tick" transform={`translate(0,${y(t)})`}>
              <line x1={M.left} x2={W - M.right} />
              <text x={M.left - 6} dy="0.32em" textAnchor="end">{t}</text>
            </g>
          ))}
          {/* x ticks (decades) */}
          {decades.map((d) => (
            <g key={d} className="tick" transform={`translate(${x(d)},${H - M.bottom})`}>
              <text y="16" textAnchor="middle">{`${String(d).slice(2)}s`}</text>
            </g>
          ))}
          <text className="axis-title" x={M.left} y={M.top - 4}>honorees</text>

          {series.map((layer) => {
            const cat = layer.key;
            return (
              <path
                key={cat}
                d={areaGen(layer)}
                fill={CATEGORY_COLORS[cat]}
                fillOpacity={0.85}
                stroke="#fff"
                strokeWidth={0.5}
                onMouseEnter={(e) =>
                  show(e, (
                    <span>
                      <strong>{cat}</strong>
                      <br />
                      {totals[cat]} honorees total
                    </span>
                  ))
                }
                onMouseMove={(e) =>
                  show(e, (
                    <span>
                      <strong>{cat}</strong>
                      <br />
                      {totals[cat]} honorees total
                    </span>
                  ))
                }
                onMouseLeave={hide}
              />
            );
          })}
        </svg>
        <Tooltip tip={tip} />
      </div>

      <div className="legend">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={!off.has(c)}
            onClick={() => toggle(c)}
            title={`${c} — ${totals[c]} total`}
          >
            <span className="swatch" style={{background: CATEGORY_COLORS[c]}} />
            {c}
          </button>
        ))}
      </div>
    </CollapsibleCard>
  );
}
