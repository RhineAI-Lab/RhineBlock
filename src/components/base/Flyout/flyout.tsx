import React, {useEffect} from 'react';
import Style from './flyout.module.css'
import {IBlock} from "../../../core/block/block.class";
import renderFlyout from "../../../core/view/flyout/flyout";

let initialised = false;

export default function Flyout(props: FlyoutProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      if(!initialised){
        renderFlyout(ref.current, props.blocks);
        initialised = true;
      }
    }
  });

  return (
    <div className={Style.holder} ref={ref}>
    </div>
  )
}

interface FlyoutProps {
  children?: React.ReactNode;
  blocks: Array<IBlock>
}
