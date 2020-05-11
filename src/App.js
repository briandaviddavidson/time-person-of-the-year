import React from 'react';
import logo from './logo.svg';
import './App.css';
import Table from './Table.js';
let people = require('./data/people.json');

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="logo">
          <span className="extra">TIME PERSON OF THE YEAR </span>
        </div>
        <Table people={people} className="table-flex"/>
      </div>
    )
  }
}

export default App;
