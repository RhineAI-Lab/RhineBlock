import SvgElCreator, {transformEl} from "../../utils/svg-el-creator";
import {Item, RootItem} from "../../block/block.class";
import BaseRender from "../../render/base/base-render";
import {RhineBlock} from "../../RhineBlock";


export default function renderGraph(dom: HTMLElement, items: Item[]): Graph {

  const graph = new Graph(dom);
  graph.setRender(items);
  graph.render();
  RhineBlock.registerGraph(graph);

  return graph

}

export class Graph {
  items: RootItem[] = []
  svg: SVGSVGElement

  constructor(dom: HTMLElement) {
    this.svg = SvgElCreator.appendSvg(dom)
  }

  setRender(items: any) {
    this.items = items
  }

  render() {
    for (const item of this.items) {
      const block = BaseRender.render(item.block, this.svg, item.args)
      transformEl(block?.view, item.x, item.y)
    }
  }

}


