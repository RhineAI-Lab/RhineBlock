import SvgElCreator, {transformEl} from "../../utils/svg-el-creator";
import Block, {Item, RootItem} from "../../block/block.class";
import BaseRender from "../../render/base/base-render";
import {RhineBlock} from "../../RhineBlock";


export default function renderGraph(dom: HTMLElement, items: RootItem[]): Graph {

  const graph = new Graph(dom);
  graph.render(items);
  RhineBlock.registerGraph(graph);

  return graph

}

export class Graph {
  blocks: Block[] = [];
  svg: SVGSVGElement

  constructor(dom: HTMLElement) {
    this.svg = SvgElCreator.appendSvg(dom)
  }

  render(items: RootItem[] = [], clear = true) {
    if(clear) this.clear()
    for (const item of items) {
      const block = Block.fromItem(item)
      BaseRender.render(block, this.svg)
      block.setPosition(item.x, item.y)
      this.blocks.push(block)
    }
  }

  clear() {
    this.svg.innerHTML = ''
    this.blocks = []
  }

}



