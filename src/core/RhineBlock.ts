import Block, {IBlock, Item, ItemValue} from "./block/block.class";
import {Graph} from "./view/graph/graph";

export class RhineBlock {
  static blocksData: IBlock[] = [];

  static registerBlocksData(blocks: IBlock[]) {
    this.blocksData = this.blocksData.concat(blocks);
  }

  static getBlockData(name: string): IBlock | null {
    return this.blocksData.find(block => block.name === name) || null;
  }

  static getBlockToolbox(name: string): ItemValue[] | boolean | undefined {
    return this.getBlockData(name)?.toolbox
  }

  static graphs: Graph[] = [];

  static registerGraph(graph: Graph) {
    this.graphs.push(graph);
  }



}
