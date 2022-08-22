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
        {value: 'boo'},
      ], [
        {text: '执行'},
        {statement: null},
      ],
    ],
    toolbox: [
      {
        id: 1,
        name: 'console_print',
        value: [
          {
            name: 'control_if',
          },
        ],
      },
    ],
  }, {
    name: 'console_print',
    type: BlockType.Statement,
    lines: [
      [
        {text: '输出'},
        {field: FieldType.Text, default: 'Hello World'},
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
    type: BlockType.Start,
    lines: [
      [
        {text: '当程序开始运行'},
      ],
    ],
  },
]

RhineBlock.registerBlocks(controlBlocks);

export default controlBlocks
