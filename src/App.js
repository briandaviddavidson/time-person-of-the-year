import React from 'react';
import './App.css';
import Table from './Table.js';
import Visualizations from './charts/Visualizations';
let people = require('./data/people.json');

class App extends React.Component {
  render() {
    const years = people.map((p) => Number(p.year)).filter(Boolean);
    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);

    return (
      <div className="App">
        <header className="masthead">
          <h1 className="logo">TIME</h1>
          <p className="masthead__subtitle">Person of the Year</p>
          <hr className="masthead__rule" />
          <p className="masthead__meta">
            Every honoree, {firstYear}–{lastYear} ·{' '}
            <strong>{people.length}</strong> entries · sortable
          </p>
        </header>
        <main>
          <Visualizations />
          <div className="table-wrap">
            <Table people={people} />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
