import React from 'react';

// Shared card chrome for every visualization. The title doubles as a toggle:
// clicking it collapses the body so the page can be skimmed as a list of views.
let uid = 0;

export default function CollapsibleCard({
  title,
  sub,
  note,
  className = '',
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useRef(`viz-card-${++uid}`).current;

  const classes = ['viz-card', className, open ? '' : 'is-collapsed']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes}>
      <h3 className="viz-card__title">
        <button
          type="button"
          className="viz-card__toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{title}</span>
          <svg className="viz-card__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      <div id={id} className="viz-card__body" hidden={!open}>
        {sub ? <p className="viz-card__sub">{sub}</p> : null}
        {children}
        {note ? <p className="viz-card__note">{note}</p> : null}
      </div>
    </section>
  );
}
