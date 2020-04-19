import React from 'react';
import logo from './logo.svg';
import './App.css';
let people = require('./data/people.json');

class App extends React.Component {
  constructor() {
    super();
    this.buildUrl = this.buildUrl.bind(this);
  }

  buildUrl(name) {
    let nameArr = name.split('(');
    let val = nameArr.length > 1 ? nameArr[1].slice(0, -1) : nameArr[0] ;
    let search = val.replace(' ', '_');
    return `https://en.wikipedia.org/wiki/${search}`;
  }
  render() {
    return (<div className="">
    <img src={logo} alt="Time Magazine" />
      <div className="">
        {
          people.map((user, index) => (
            <div key={index}>
              <h3><a href={this.buildUrl(user.name)}>{user.name}</a></h3>
              <p>{user.country || "Various"}</p>
              <p>Title: {user.title}</p>
              <p>Category: {user.category}</p>
              <p>Context: {user.context}</p>
            </div>
          ))
        }
      </div>
    </div>)
  }
}

export default App;
