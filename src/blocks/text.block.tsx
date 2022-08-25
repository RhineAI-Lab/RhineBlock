import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const textBlocks: IBlock[] = [
  {
    name: "text_input",
    type: BlockType.Output,
    color: '#712be4',
    lines: [
      [
        {text: "“"},
        {field: FieldType.Text, default: 'hello world'},
        {text: "“"},
      ]
    ]
  }, {
    name: "text_length",
    type: BlockType.Output,
    color: '#712be4',
    lines: [
      [
        {value: 'Text'},
        {text: "的长度"},
      ]
    ]
  }, {
    name: "text_isempty",
    type: BlockType.Output,
    color: '#712be4',
    lines: [
      [
        {value: 'Text'},
        {text: "是否为空"},
      ]
    ]
  }, {
    name: "text_reverse",
    type: BlockType.Output,
    color: '#712be4',
    lines: [
      [
        {text: "倒转文本"},
        {value: 'Text'},
      ]
    ]
  },
]

RhineBlock.registerBlocks(textBlocks);

export default textBlocks