import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const loopBlocks: IBlock[] = [
  {
    name: "loop_times",
    type: BlockType.Statement,
    color:"#f15c84",
    lines: [
      [
        {text: '重复'},
        {field: FieldType.Text, default: '10'},
        {text: '次'},
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
  },{
    name: "loop_conditions",
    type: BlockType.Statement,
    color:"#f15c84",
    lines: [
      [
        {text: "当满足"},
        {value: 'bool'},
        {text: "时重复"}
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
  },{
    name: 'loop_break',
    type: BlockType.Finish,
    color:"#f15c84",
    lines: [
      [
        {text: '跳出循环'},
      ],
    ],
  }
]

RhineBlock.registerBlocksData(loopBlocks);

export default loopBlocks
