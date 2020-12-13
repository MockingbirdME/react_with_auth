import React, { Component } from 'react';
import './App.css';
import {UserContextProvider} from "./contexts/user";

import User from "./components/user";

class App extends Component {
  render() {
    return (
      <UserContextProvider>
        <div className="App">
          <User />
        </div>
      </UserContextProvider>
    );
  }
}

export default App;
