import React from 'react';
import './charts.css';
import WorldMap from './WorldMap';
import CategoryStream from './CategoryStream';
import HonorTimeline from './HonorTimeline';
import AgeBeeswarm from './AgeBeeswarm';
import RepeatHonorees from './RepeatHonorees';

export default function Visualizations() {
  return (
    <section className="viz-section" aria-labelledby="viz-heading">
      <div className="viz-section__head">
        <h2 id="viz-heading">Beyond the table</h2>
        <p>
          Five views into a century of honorees — drawn straight from the same data with D3.
          Tap any title to collapse it.
        </p>
      </div>
      <div className="viz-grid">
        <WorldMap />
        <CategoryStream />
        <HonorTimeline />
        <AgeBeeswarm />
        <RepeatHonorees />
      </div>
    </section>
  );
}
