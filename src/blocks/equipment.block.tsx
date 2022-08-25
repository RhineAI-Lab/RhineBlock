import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const equipmentBlocks: IBlock[] = [
  {
    name: 'equipment_state',
    type: BlockType.Output,
    color: '#ffac5d',
    lines: [
      [
        {text: '设备'},
        {field: FieldType.Text, default: 'A'},
        {text: '为'},
        {field: FieldType.Text, default: '开'},
      ]
    ]
  }, {
    name: 'equipment_control',
    type: BlockType.Statement,
    color: '#ffac5d',
    lines: [
      [
        {field: FieldType.Text, default: '开启'},
        {text: '设备'},
        {field: FieldType.Text, default: 'A'},
      ],
    ]
  }, {
    name: 'equipment_getvalue',
    type: BlockType.Output,
    color: '#ffac5d',
    lines: [
      [
        {field: FieldType.Text, default: 'A'},
        {text: '的数值'},
      ],
    ]
  }, {
    name: 'equipment_setvalue',
    type: BlockType.Statement,
    color: '#ffac5d',
    lines: [
      [
        {text: "设置"},
        {field: FieldType.Text, default: 'A'},
        {text: "的数值为"},
        {field: FieldType.Text, default: ' '},
      ],
    ]
  }

]

RhineBlock.registerBlocks(equipmentBlocks);

export default equipmentBlocks
