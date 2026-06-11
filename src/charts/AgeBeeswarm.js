import React from 'react';
import {scaleLinear} from 'd3-scale';
import {extent, mean} from 'd3-array';
import {forceSimulation, forceX, forceY, forceCollide} from 'd3-force';
import {ageData, HONOR_GROUPS} from './prepData';
import {useTooltip, Tooltip} from './Tooltip';
import CollapsibleCard from './CollapsibleCard';

const W = 640;
const H = 300;
const M = {top: 24, right: 20, bottom: 40, left: 20};
const R = 4.5;

const {items} = ageData();
const ageExtent = extent(items, (d) => d.age);
const avg = mean(items, (d) => d.age);

export default function AgeBeeswarm() {
  const {tip, show, hide} = useTooltip();

  const x = scaleLinear()
    .domain([Math.floor((ageExtent[0] - 2) / 5) * 5, Math.ceil((ageExtent[1] + 2) / 5) * 5])
    .range([M.left, W - M.right]);
  const midY = (M.top + (H - M.bottom)) / 2;

  // Force-spread the dots vertically; compute once (deterministic enough).
  const nodes = React.useMemo(() => {
    const data = items.map((d) => ({...d}));
    const sim = forceSimulation(data)
      .force('x', forceX((d) => x(d.age)).strength(1))
      .force('y', forceY(midY).strength(0.06))
      .force('collide', forceCollide(R + 1).iterations(3))
      .stop();
    for (let i = 0; i < 240; i++) sim.tick();
    return data;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const youngest = items.reduce((a, b) => (b.age < a.age ? b : a));
  const oldest = items.reduce((a, b) => (b.age > a.age ? b : a));

  const tipFor = (d) => (
    <span>
      <strong>{d.name}</strong>, {d.age}
      <br />
      <span className="muted">
        {d.title ? `${d.title} · ` : ''}
        {d.year}
      </span>
    </span>
  );

  return (
    <CollapsibleCard
      title="How old, when honored?"
      sub={
        <>
          Each dot is an honoree, placed by their age that year. Most cluster in their 50s–60s;
          Greta Thunberg is the youngest ever at {youngest.age}.
        </>
      }
    >
      <div style={{position: 'relative'}}>
        <svg className="viz-svg" viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={`Beeswarm of honoree ages. Ages range from ${ageExtent[0]} to ${ageExtent[1]}, averaging about ${Math.round(avg)}. Youngest: ${youngest.name} at ${youngest.age}. Oldest: ${oldest.name} at ${oldest.age}.`}>
          {/* x axis ticks */}
          {x.ticks(8).map((t) => (
            <g key={t} className="tick" transform={`translate(${x(t)},${H - M.bottom})`}>
              <line y1={-(H - M.bottom - M.top)} y2={0} />
              <text y="16" textAnchor="middle">{t}</text>
            </g>
          ))}
          <text className="axis-title" x={W / 2} y={H - 6} textAnchor="middle">age when honored</text>

          {/* average marker */}
          <line className="annotation-line" x1={x(avg)} x2={x(avg)} y1={M.top} y2={H - M.bottom} />
          <text className="annotation" x={x(avg) + 4} y={M.top + 2}>avg {Math.round(avg)}</text>

          {nodes.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={R}
              fill={HONOR_GROUPS[d.group].color}
              fillOpacity={0.85}
              stroke="#fff"
              strokeWidth={0.6}
              onMouseEnter={(e) => show(e, tipFor(d))}
              onMouseMove={(e) => show(e, tipFor(d))}
              onMouseLeave={hide}
            />
          ))}
        </svg>
        <Tooltip tip={tip} />
      </div>
    </CollapsibleCard>
  );
}
