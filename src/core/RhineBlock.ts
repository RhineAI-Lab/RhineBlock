import {IBlock} from "./block/block.class";

export class RhineBlock{
  static blocks: Array<IBlock> = [];

  static registerBlocks(blocks: Array<IBlock>){
    this.blocks = this.blocks.concat(blocks);
  }

  static getBlock(name: string): IBlock | null{
    return this.blocks.find(block => block.name === name) || null;
  }

}
