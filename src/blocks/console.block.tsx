import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const logicBlocks: IBlock[] = [
  {
    name: 'logic_if',
    type: BlockType.Statement,
    color: '#59c75b',
    lines: [
      [
        {text: '如果'},
        {value: 'boolean'},
      ],
      [
        {text: '执行'},
        {statement: null},
      ],
    ],
    toolbox: [
      // {block: 'math_add', args: [{block: 'math_add', args: [{block: 'number_random_float'}]}]},
      // {block: 'control_if', args: [null, {block: 'console_print'}]},
    ]
  }, {
    name: 'logic_xorgate',
    type: BlockType.Output,
    color: '#59c75b',
    lines: [
      [
        {field: FieldType.Text, default: 'A'},
        {field: FieldType.Text, default: '>'},
        {field: FieldType.Text, default: 'B'},
      ]
    ]
  }, {
    name: 'logic_gate',
    type: BlockType.Output,
    color: '#59c75b',
    lines: [
      [
        {value: 'boolean'},
        {field: FieldType.Text, default: '并且'},
        {value: 'boolean'},
      ]
    ],
    toolbox:[]
  },{
    name: 'logic_not',
    type: BlockType.Output,
    color: '#59c75b',
    lines: [
      [
        {text: "非"},
        {value: 'boolean'},
      ]
    ]
  },
  // {
  //   name: 'logic_null',
  //   type: BlockType.Output,
  //   color: '#59c75b',
  //   lines: [
  //     [
  //       {text: "空"},
  //     ]
  //   ]
  // }
]

RhineBlock.registerBlocks(logicBlocks);

export default logicBlocks
