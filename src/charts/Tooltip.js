import React from 'react';

// Shared hover-tooltip. State holds {x, y, content}; render <Tooltip tip={tip}/>
// inside a position:relative container.
export function useTooltip() {
  const [tip, setTip] = React.useState(null);
  const show = (evt, content) => {
    const rect = evt.currentTarget.ownerSVGElement
      ? evt.currentTarget.ownerSVGElement.parentNode.getBoundingClientRect()
      : evt.currentTarget.getBoundingClientRect();
    setTip({x: evt.clientX - rect.left, y: evt.clientY - rect.top, content});
  };
  const hide = () => setTip(null);
  return {tip, show, hide};
}

export function Tooltip({tip}) {
  if (!tip) return null;
  return (
    <div
      className="chart-tooltip"
      style={{left: tip.x, top: tip.y}}
      role="tooltip"
      aria-hidden="true"
    >
      {tip.content}
    </div>
  );
}
