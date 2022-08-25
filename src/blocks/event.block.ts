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
    toolbox: [
      // {block: 'math_add', args: [{block: 'math_add', args: [{block: 'number_random_float'}]}]},
      // {block: 'control_if', args: [null, {block: 'console_print'}]},
    ]
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

RhineBlock.registerBlocks(eventBlocks);

export default eventBlocks
