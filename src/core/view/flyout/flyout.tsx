import Block , {IBlock} from "../../block/block.class";
import BaseRender from "../../render/base/base-render";

export default function renderFlyout(dom: HTMLElement, blocks: IBlock[]) {

  const MARGIN_LEFT = 40;
  const MARGIN_TOP = 40;
  const HEIGHT = 140;

  const svg = appendSvg(dom)
  for(let i in blocks) {
    if(blocks[i].toolbox === false) continue;

    let block = Block.fromJson(blocks[i], null);

    let blockEl = BaseRender.render(block, svg)
    blockEl.setAttribute("transform",
      `translate(${MARGIN_LEFT},${HEIGHT * parseInt(i) + MARGIN_TOP})`
    )
  }
}

function appendSvg(parent: HTMLElement) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = "100%";
  svg.style.height = "100%";
  parent.appendChild(svg);
  return svg
}
