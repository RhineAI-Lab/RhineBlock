import Block from "../block/block.class";

export default class DragManager {

  static dragBlock: Block | null = null;

  static onDragBlock(block: Block) {
    this.dragBlock = block
  }
}


