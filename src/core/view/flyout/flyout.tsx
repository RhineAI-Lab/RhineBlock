import Block , {IBlock} from "../../block/block.class";
import BaseRender from "../../render/base/base-render";
import {RhineBlock} from "../../RhineBlock";

import "../../../blocks/event.block";
import "../../../blocks/equipment.block";

export default function renderFlyout(dom: HTMLElement, blocks: string[]) {

  const MARGIN_LEFT = 40;
  const MARGIN_TOP = 40;
  const SPACING = 60;

  const svg = appendSvg(dom)
  let y = MARGIN_TOP
  for(let i in blocks) {
    const data = RhineBlock.getBlockData(blocks[i])
    if(!data || data.toolbox === false) continue;

    let block = Block.fromJson(data);
    if(data.toolbox instanceof Array) {
      block.setArgs(data.toolbox);
    }

    let blockEl = BaseRender.render(block, svg)
    blockEl.setAttribute("transform",
      `translate(${MARGIN_LEFT},${y})`
    )
    y += block.height + SPACING
  }
}

function appendSvg(parent: HTMLElement) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = "100%";
  svg.style.height = "100%";
  parent.appendChild(svg);
  return svg
}
