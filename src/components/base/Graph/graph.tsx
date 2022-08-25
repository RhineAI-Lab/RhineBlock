import React, {useEffect} from 'react';
import Style from './graph.module.css'
import renderGraph from "../../../core/view/graph/graph";
import {testData} from "./test-data";

export default function Graph(props: any) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const graph = renderGraph(ref.current, testData);
    }
  }, [])

  return (
    <div className={Style.holder} ref={ref}>
    </div>
  )
}
