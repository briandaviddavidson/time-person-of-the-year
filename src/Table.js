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

const Table = (props) => {
  const {people, requestSort, sortConfig} = useSortableData(props.people);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name
      ? sortConfig.direction
      : undefined;
  };
  return (<table>
    <thead>
      <tr>
        <th>
          <button type="button" onClick={() => requestSort('name')} className={getClassNamesFor('name')}>
            Name
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('year')} className={getClassNamesFor('year')}>
            Year
          </button>
        </th>
        <th>
          <button type="button" onClick={() => requestSort('birth')} className={getClassNamesFor('birth')}>
            Birth
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {
        people.map((person, index) => (<tr key={index}>
          <td>{person.name}</td>
          <td>{person.year}</td>
          <td>{person.birth}</td>
        </tr>))
      }
    </tbody>
  </table>);
};

//
// buildUrl(name) {
//   let nameArr = name.split('(');
//   let val = nameArr.length > 1 ? nameArr[1].slice(0, -1) : nameArr[0] ;
//   let search = val.replace(' ', '_');
//   return `https://en.wikipedia.org/wiki/${search}`;
// }
//
// setBirthAndDeath(birth, death) {
//   if (!birth && !death) {
//     return ''
//   } else if (birth && !death) {
//     return `Born in ${birth}`;
//   } else {
//     return `${birth}-${death}`;
//   }
// }
//
// calcAge(birth, year) {
//   if (!birth) {
//     return '';
//   }
//   let age = year-birth;
//   return `at the age of ${age}`;
// }
//
// render () {
//   return (
//     <div className="">
//       {
//         people.map((user, index) => (
//           <div key={index}>
//             <h3><a href={this.buildUrl(user.name)}>{user.name}</a></h3>
//             <p>{user.honor} in {user.year} {this.calcAge(user.birth, user.year)}</p>
//             <p>{user.country || "Various"}</p>
//             <p>{this.setBirthAndDeath(user.birth, user.death)}</p>
//             <p>Title: {user.title}</p>
//             <p>Category: {user.category}</p>
//             <p>Context: {user.context}</p>
//           </div>
//         ))
//       }
//     </div>
//   )
// }
// }

export default Table;
