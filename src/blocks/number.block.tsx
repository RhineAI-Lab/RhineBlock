import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const numberBlocks: IBlock[] = [
  {
    name: "number_value",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {field: FieldType.Text, default: '123'},
      ]
    ]
  }, {
    name: "number_basiccal",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {value: 'number'},
        {field: FieldType.Text, default: '+'},
        {value: 'number'},
      ]
    ],
    toolbox: []
  }, {
    name: "number_seniorcal",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {field: FieldType.Text, default: '平方根'},
        {value: 'number'},
      ]
    ],
    toolbox: []
  }, {
    name: "number_trifunc",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {field: FieldType.Text, default: 'sin'},
        {value: 'number'},
      ]
    ],
    toolbox: []
  }, {
    name: "number_constant",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {field: FieldType.Text, default: 'π'},
      ]
    ],
  },{
    name: "number_type",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {value: 'number'},
        {field: FieldType.Text, default: '是偶数'},
      ]
    ],
    toolbox: []
  },
  //修改
  {
    name: "number_round",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {field: FieldType.Text, default: '四舍五入'},
        {value: 'number'},
      ]
    ],
    toolbox: []
  },{
    name: "number_listoperation",
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {field: FieldType.Text, default: '列表中数值的和'},
        {value: 'Array'},
      ]
    ],
    toolbox: []
  },{
    name: 'number_randomfloat',
    type: BlockType.Output,
    color: '#5eead8',
    lines: [
      [
        {text: '随机小数'},
      ],
    ],
  },
]

RhineBlock.registerBlocksData(numberBlocks);

export default numberBlocks
