import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const loopBlocks: IBlock[] = [
  {
    name: "loop_times",
    type: BlockType.Hat,
    lines: []
  }
]

RhineBlock.registerBlocks(loopBlocks);

export default loopBlocks