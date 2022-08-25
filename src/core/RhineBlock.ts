import {IBlock, Item, ItemValue} from "./block/block.class";

export class RhineBlock {
  static blocks: IBlock[] = [];

  static registerBlocks(blocks: IBlock[]) {
    this.blocks = this.blocks.concat(blocks);
  }

  static getBlockData(name: string): IBlock | null {
    return this.blocks.find(block => block.name === name) || null;
  }

  static getBlockToolbox(name: string): ItemValue[] | boolean | undefined {
    return this.getBlockData(name)?.toolbox
  }

}
