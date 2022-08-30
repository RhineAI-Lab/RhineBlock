import Block, {IBlock, Item, ItemValue} from "./block/block.class";
import {Graph} from "./view/graph/graph";
import BaseRender from "./render/base/base-render";

export class RhineBlock {
  static Render: typeof BaseRender = BaseRender;

  static setRender(render: typeof BaseRender) {
    this.Render = render;
  }


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

  static mapGraph(fn: (graph: Graph) => void, expectToolbox = true) {
    if (!expectToolbox) {
      this.graphs.forEach(fn)
    }else{
      this.graphs.forEach(graph => {
        if(!graph.isToolbox) fn(graph)
      })
    }
  }

  static getFirstGraphWithoutToolbox(): Graph | null {
    return this.graphs.find(graph => !graph.isToolbox) || null;
  }



}
