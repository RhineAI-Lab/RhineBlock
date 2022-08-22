import Block , {IBlock} from "../../block/block.class";
import {BaseRender} from "../../render/base/base-render";

export default function renderFlyout(dom: HTMLElement, blocks: Array<IBlock>) {
  const svg = appendSvg(dom)
  for(let i in blocks) {
    let block = Block.fromJson(blocks[i], null);
    let blockEl = BaseRender.render(block)
    blockEl.setAttribute("transform", "translate(50,50)")
    svg.appendChild(blockEl);
  }
}

function appendSvg(parent: HTMLElement) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = "100%";
  svg.style.height = "100%";
  parent.appendChild(svg);
  return svg
}
