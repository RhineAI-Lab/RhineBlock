import React, {useEffect} from 'react';
import Style from './flyout.module.css'
import {IBlock} from "../../../core/block/block.class";
import renderFlyout from "../../../core/view/flyout/flyout";

let initialised = false;

export default function Flyout(props: FlyoutProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flyoutBlocks = [
      'control_if',
      'events_do',
      'console_print',
      'math_add',
      'control_start',
      'number_random_float',
      'loop_break',
    ]
    if (ref.current) {
      if (!initialised) {
        renderFlyout(ref.current, flyoutBlocks);
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
  blocks: IBlock[];
}
