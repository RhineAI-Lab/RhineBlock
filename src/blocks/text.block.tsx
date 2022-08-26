import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const textBlocks: IBlock[] = [
  {
    name: "text_input",
    type: BlockType.Output,
    color: '#7b36ee',
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
    color: '#7b36ee',
    lines: [
      [
        {value: 'Text'},
        {text: "的长度"},
      ]
    ]
  }, {
    name: "text_isempty",
    type: BlockType.Output,
    color: '#7b36ee',
    lines: [
      [
        {value: 'Text'},
        {text: "是否为空"},
      ]
    ]
  }, {
    name: "text_reverse",
    type: BlockType.Output,
    color: '#7b36ee',
    lines: [
      [
        {text: "倒转文本"},
        {value: 'Text'},
      ]
    ]
  }, {
    name: "text_to_number",
    type: BlockType.Output,
    color: '#7b36ee',
    lines: [
      [
        {text: "转换为数字"},
        {value: 'Text'},
      ]
    ]
  }, {
    name: "text_to_string",
    type: BlockType.Output,
    color: '#7b36ee',
    lines: [
      [
        {text: "转换为文本"},
        {value: 'Text'},
      ]
    ]
  }, {
    name: "text_contain",
    type: BlockType.Output,
    color: '#7b36ee',
    lines: [
      [
        {value: 'Text'},
        {text: "是否包含"},
        {value: 'Text'},
      ]
    ]
  }, {
    name: "text_case",
    type: BlockType.Output,
    color: '#7b36ee',
    lines: [
      [
        {text: "转为"},
        {field: FieldType.Text, default: '大写'},
        {value: 'Text'},
      ]
    ]
  },
]

RhineBlock.registerBlocks(textBlocks);

export default textBlocks
