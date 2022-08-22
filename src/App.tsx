import React from 'react';
import './App.css';
import Flyout from "./components/base/Flyout/flyout";
import controlBlock from "./blocks/control.block";

function App() {
  return (
    <div className="App">
      <Flyout blocks={controlBlock}/>
    </div>
  );
}

export default App;
