import React, {useEffect} from 'react';
import Style from './flyout.module.css'
import {IBlock} from "../../../core/block/block.class";
import renderFlyout from "../../../core/view/flyout/flyout";

let initialised = false;

export default function Flyout(props: FlyoutProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flyoutBlocks = [
      [
        'event_start',
        'event_equipstate',
        'event_change',
        'event_compare',
        'equipment_state',
        'equipment_control',
        'equipment_getvalue',
        'equipment_setvalue',
      ], [
        'loop_times',
        'loop_conditions',
        'loop_break',
        'logic_if',
        'logic_gate',
        'logic_not',
        'logic_null',

        // 'events_do',
        // 'console_print',

      ], [
        'number_basiccal',
        'number_seniorcal',
        'number_trifunc',
        'number_constant',
        'number_type',
        'number_round',
        'number_listoperation',
        'number_randomfloat',
      ], [
        'text_input',
        'text_create',
        'text_length',
        'text_isempty',
        'text_reverse',
      ]
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
  blocks?: IBlock[];
}
