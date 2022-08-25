import SvgElCreator from "../../render/base/svg-el-creator";
import Block, {Item} from "../../block/block.class";


export default function renderGraph(dom: HTMLElement, items: Item[]): Graph {

  const graph = new Graph(dom);
  graph.setRender(items);

  return graph

}

export class Graph {
  items: any[] = []
  svg: SVGSVGElement

  constructor(dom: HTMLElement) {
    this.svg = SvgElCreator.appendSvg(dom)
    this.items.push(dom)
  }

  setRender(items: any) {
    this.items = items
  }

  render() {

  }

}


