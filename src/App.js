import React from 'react';
import logo from './logo.svg';
import './App.css';
import Table from './Table.js';
let people = require('./data/people.json');

class App extends React.Component {
  render() {
    return (
      <div className="">
      <img src={logo} alt="Time Magazine" />
        <Table people={people} />
      </div>
    )
  }
}

export default App;
