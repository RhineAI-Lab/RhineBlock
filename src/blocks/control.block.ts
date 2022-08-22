import Block, {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";

const controlBlocks: Array<IBlock> = [
  {
    name: 'control_if',
    type: BlockType.Statement,
    lines: [
      [
        {text: '如果'},
        {value: 'boo'},
      ],[
        {text: '执行'},
        {statement: null},
      ]
    ],
    toolbox: [
      {
        id: 1,
        name: 'control_if',
        value: [
          {
            name: 'control_if',
          }
        ]
      }
    ]
  }
]

RhineBlock.registerBlocks(controlBlocks);

export default controlBlocks
