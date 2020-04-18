import React from 'react';
import logo from './logo.svg';
import './App.css';
let people = require('./data/people.json');

class App extends React.Component {
  render() {
    return (<div class="flex">
    <img src={logo} alt="Time Magazine" />
      <div className="users">
        {
          people.map((user, index) => (<div key={index}>
            <h3>{user.name}</h3>
            <p>{user.year}</p>
            <p>{user.birth || "Various"}</p>
          </div>))
        }
      </div>
    </div>)
  }
}

export default App;
