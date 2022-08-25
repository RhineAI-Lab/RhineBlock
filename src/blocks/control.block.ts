import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const controlBlocks: IBlock[] = [
  {
    name: 'control_if',
    type: BlockType.Statement,
    lines: [
      [
        {text: '如果'},
        {value: 'boolean'},
      ],
      [
        {text: ''},
        {statement: null},
      ],
    ],
  }, {
    name: 'events_do',
    type: BlockType.Statement,
    lines: [
      [
        {text: '执行A'},
        {statement: null},
      ],
      [
        {text: '执行B'},
        {statement: null},
      ],
    ],
  }, {
    name: 'console_print',
    type: BlockType.Statement,
    lines: [
      [
        {text: '输出'},
        {field: FieldType.Text, default: 'hello'},
      ],
    ],
  }, {
    name: 'math_add',
    type: BlockType.Output,
    lines: [
      [
        {value: 10},
        {text: '+'},
        {value: 20},
      ],
    ],
  }, {
    name: 'control_start',
    type: BlockType.Hat,
    lines: [
      [
        {text: '当程序开始运行'},
      ],
    ],
  }, {
    name: 'number_random_float',
    type: BlockType.Output,
    lines: [
      [
        {text: '随机小数'},
      ],
    ],
  }, {
    name: 'loop_break',
    type: BlockType.Finish,
    lines: [
      [
        {text: '跳出循环'},
      ],
    ],
  }
]

RhineBlock.registerBlocks(controlBlocks);

export default controlBlocks
