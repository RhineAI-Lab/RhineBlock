import Block, {BlockType, IBlock} from "../core/block/block.class";

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
  }
]

export default controlBlocks
