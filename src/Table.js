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

const Table = (props) => {
  const {people, requestSort, sortConfig} = useSortableData(props.people);
  people.forEach(calcAges);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name
      ? sortConfig.direction
      : undefined;
  };
  return (<table className="table">
    <thead>
      <tr>
        <th>
          <button type="button" onClick={() => requestSort('name')} className={`button ${getClassNamesFor('name')}`}>
            Name
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('awardAge')} className={`button ${getClassNamesFor('awardAge')}`}>
            Award Age
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('deathAge')} className={`button ${getClassNamesFor('deathAge')}`}>
            Death Age (if applicable)
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('honor')} className={`button ${getClassNamesFor('honor')}`}>
            Honor
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('year')} className={`button ${getClassNamesFor('year')}`}>
            Year
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('birth')} className={`button ${getClassNamesFor('birth')}`}>
            Birth
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('death')} className={`button ${getClassNamesFor('death')}`}>
            Death
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {
        people.map((person, index) => (<tr key={index}>
          <td>
            <a href={buildUrl(person.name)} rel="noopener noreferrer" target="_blank">{person.name}</a>
          </td>
          <td>{person.awardAge}</td>
          <td>{person.deathAge}</td>
          <td>{person.honor}</td>
          <td>{person.year}</td>
          <td>{person.birth}</td>
          <td>{person.death}</td>
        </tr>))
      }
    </tbody>
  </table>);
};

export default Table;
