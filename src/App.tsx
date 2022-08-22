import React from 'react';
import './App.css';
import Flyout from "./components/base/Flyout/flyout";
import controlBlock from "./blocks/control.block";
import SvgBuilder from "./core/utils/svg-builder";

function App() {
  const svgBuilder = new SvgBuilder();
  const temp = svgBuilder
    .moveTo(0, 0, true)
    .lineTo(100, 0, true)
    .build();
  console.log(temp);
  return (
    <div className="App">
      <Flyout blocks={controlBlock}/>
    </div>
  );
}

export default App;
