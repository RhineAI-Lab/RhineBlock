import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const eventBlocks: IBlock[] = [
  {
    name: 'event_start',
    type: BlockType.Hat,
    color: '#5399ff',
    lines: [
      [
        {text: '当程序开始运行'},
      ],
    ],
    // toolbox: [
    //   {next: true, block: 'control_if'}
    // ]
  }, {
    name: 'event_equipstate',
    type: BlockType.Hat,
    color: '#5399ff',
    lines: [
      [
        {text: '当开关'},
        {field: FieldType.Text, default: 'A'},
        {field: FieldType.Text, default: '开启'},
        {text: '时'},
      ],
    ],
  }, {
    name: 'event_change',
    type: BlockType.Hat,
    color: '#5399ff',
    lines: [
      [
        {text: '当数值'},
        {field: FieldType.Text, default: 'A'},
        {text: '变化时'},
      ],
    ],
  }, {
    name: 'event_compare',
    type: BlockType.Hat,
    color: '#5399ff',
    lines: [
      [
        {text: '当数值'},
        {field: FieldType.Text, default: 'A'},
        {field: FieldType.Text, default: '>'},
        {field: FieldType.Text, default: '10'},
        {text: '时'},
      ],
    ],
  },


  {
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
  },
]

RhineBlock.registerBlocks(eventBlocks);

export default eventBlocks
