import React, {useEffect} from 'react';
import Style from './graph.module.css'
import renderGraph from "../../../core/view/graph/graph";
import {easyTestData, testData} from "./test-data";

let initialized = false;

export default function Graph(props: any) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !initialized) {
      const graph = renderGraph(ref.current, easyTestData);
      initialized = true;
    }
  }, [])

  return (
    <div className={Style.holder} ref={ref}>
    </div>
  )
}
