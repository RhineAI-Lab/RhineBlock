import {BlockType, IBlock} from "../core/block/block.class";
import {RhineBlock} from "../core/RhineBlock";
import {FieldType} from "../core/block/arg.class";

const logicBlocks: IBlock[] = [
  {
    name: "event_start",
    type: BlockType.Hat,
    lines: []
  }
]

RhineBlock.registerBlocks(logicBlocks);

export default logicBlocks
