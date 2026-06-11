import React from 'react';

const useSortableData = (people, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedPeople = React.useMemo(() => {
    let sortablePeople = [...people];
    if (sortConfig !== null) {
      sortablePeople.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending'
            ? -1
            : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending'
            ? 1
            : -1;
        }
        return 0;
      });
    }
    return sortablePeople;
  }, [people, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({key, direction});
  };

  return {people: sortedPeople, requestSort, sortConfig};
};

function buildUrl(name) {
  let nameArr = name.split('(');
  let val = nameArr.length > 1 ? nameArr[1].slice(0, -1) : nameArr[0] ;
  let search = val.replace(' ', '_');
  return `https://en.wikipedia.org/wiki/${search}`;
}

function calcAges(person) {
  if (!person.birth) {
    person.awardAge = ''
  } else {
    person.awardAge = person.year-person.birth;
  }

  if (!person.death) {
    person.deathAge = '';
  } else {
    person.deathAge = person.death-person.birth;
  }

  return person;
}

// Decorative caret; meaning is conveyed via aria-sort + label, not color/icon alone.
const SortIcon = () => (
  <svg
    className="sort-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// Numeric columns render empty values as an em dash placeholder.
const NumCell = ({value}) => (
  <td className="num">
    {value === '' || value === undefined || value === null
      ? <span className="empty" aria-hidden="true">—</span>
      : value}
  </td>
);

const COLUMNS = [
  {key: 'name', label: 'Name', num: false},
  {key: 'awardAge', label: 'Award Age', num: true},
  {key: 'deathAge', label: 'Death Age', num: true},
  {key: 'honor', label: 'Honor', num: false},
  {key: 'year', label: 'Year', num: true},
  {key: 'birth', label: 'Birth', num: true},
  {key: 'death', label: 'Death', num: true},
];

const Table = (props) => {
  const {people, requestSort, sortConfig} = useSortableData(props.people, {
    key: 'year',
    direction: 'descending',
  });
  people.forEach(calcAges);

  const directionFor = (key) =>
    sortConfig && sortConfig.key === key ? sortConfig.direction : undefined;

  const ariaSortFor = (key) => {
    const dir = directionFor(key);
    if (dir === 'ascending') return 'ascending';
    if (dir === 'descending') return 'descending';
    return 'none';
  };

  return (
    <div className="table-scroll" role="region" aria-label="TIME Person of the Year honorees" tabIndex="0">
      <table className="table">
        <caption className="visually-hidden">
          Sortable table of every TIME Person of the Year. Activate a column header to sort.
        </caption>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} scope="col" aria-sort={ariaSortFor(col.key)}>
                <button
                  type="button"
                  onClick={() => requestSort(col.key)}
                  className={`button ${col.num ? 'num' : ''} ${directionFor(col.key) || ''}`}
                >
                  {col.label}
                  <SortIcon />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((person, index) => (
            <tr key={index}>
              <td>
                <a href={buildUrl(person.name)} rel="noopener noreferrer" target="_blank">
                  {person.name}
                </a>
              </td>
              <NumCell value={person.awardAge} />
              <NumCell value={person.deathAge} />
              <td>
                {person.honor ? <span className="honor">{person.honor}</span> : null}
              </td>
              <NumCell value={person.year} />
              <NumCell value={person.birth} />
              <NumCell value={person.death} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
