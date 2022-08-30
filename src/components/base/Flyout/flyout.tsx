import React, {useEffect} from 'react';
import Style from './flyout.module.css'
import {IBlock} from "../../../core/block/block.class";
import renderFlyout from "../../../core/view/flyout/flyout";
import {RhineBlock} from "../../../core/RhineBlock";
import MellowRender from "../../../core/render/mellow/mellow-render";

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

        'loop_times',
        'loop_conditions',
        'loop_break',
      ], [
        'logic_if',
        'logic_gate',
        'logic_not',

        'number_basiccal',
        'number_seniorcal',
        'number_trifunc',
        'number_constant',
        'number_type',
        'number_round',
        'number_listoperation',
        'number_randomfloat',

        // 'events_do',
        // 'console_print',
      ], [
        'text_input',
        'text_length',
        'text_isempty',
        'text_reverse',
        'text_to_number',
        'text_to_string',
        'text_contain',
        'text_case',

        'console_output',
        'console_input',
        'console_sleep',
      ]
    ]
    if (ref.current) {
      if (!initialised) {
        RhineBlock.setRender(MellowRender);
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
