import SvgElCreator, {transformEl} from "../../utils/svg-el-creator";
import Block, {Item} from "../../block/block.class";
import {RhineBlock} from "../../RhineBlock";


export default function renderGraph(dom: HTMLElement, items: Item[]): Graph {
  const graph = new Graph(dom);
  graph.render(items, true);
  RhineBlock.registerGraph(graph);
  return graph
}

export class Graph {
  blocks: Block[] = [];
  svg: SVGSVGElement
  isToolbox: boolean = false;

  constructor(dom: HTMLElement) {
    this.svg = SvgElCreator.appendSvg(dom)
  }

  // 渲染图形块至当前画布
  // 返回当前画布中根节点的个数
  render(items: Item[] = [], clear = false): number {
    if (clear) this.clear()
    for (const item of items) {
      const block = Block.fromItem(item)
      RhineBlock.Render.render(block, this.svg)
      block.setPosition(item.x || 100, item.y || 100)
      block.graph = this
      this.blocks.push(block)
    }
    return this.blocks.length
  }

  // 递归遍历所有图形块
  recurBlocks(fn: (block: Block) => void) {
    for (const tb of this.blocks) {
      tb.recurMapBlock(fn)
    }
  }

  // 通过Block移除内容
  remove(block: Block) {
    const i = this.blocks.indexOf(block)
    if (i < 0) return
    if (block.view) {
      this.svg.removeChild(block.view)
    }
    block.graph = null
    this.blocks.splice(i, 1)
  }

  clear() {
    this.svg.innerHTML = ''
    this.blocks = []
  }

}



