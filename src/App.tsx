import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './test/Test';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Test />
        </header>
      </div>
    );
  }
}

export default App;
