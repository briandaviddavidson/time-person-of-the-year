import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  let people = require('./data/people.json')


  return (
    <div className="App">
    <img src={logo} />
    {people.map((person, index) => (
        <div key={index}>
          <h3>{person.name}</h3>
          <p>{person.year}</p>
          <p>{person.country}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
