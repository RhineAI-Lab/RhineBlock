import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const consoleBlock: IBlock[] = [
  {
    name: 'console_output',
    type: BlockType.Statement,
    color: '#ff8a22',
    lines: [
      [
        {text: '输出'},
        {value: 'Hello World'},
      ],
    ],
  }, {
    name: 'console_input',
    type: BlockType.Output,
    output: 'Text',
    color: '#ff8a22',
    lines: [
      [
        {text: '获取控制台输入'},
      ],
    ],
  }, {
    name: 'console_sleep',
    type: BlockType.Statement,
    color: '#ff8a22',
    lines: [
      [
        {text: '等待'},
        {field: FieldType.Text, default: '1'},
        {text: '秒'},
      ],
    ],
  },
]

RhineBlock.registerBlocksData(consoleBlock);

export default consoleBlock
