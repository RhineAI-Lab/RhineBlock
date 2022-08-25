import Block from "../../block/block.class";
import BaseRender from "../../render/base/base-render";
import {RhineBlock} from "../../RhineBlock";

import "../../../blocks/event.block";
import "../../../blocks/equipment.block";
import SvgElCreator from "../../render/base/svg-el-creator";

export default function renderFlyout(dom: HTMLElement, blocks: string[][]) {

  const MARGIN_LEFT = 40;
  const MARGIN_TOP = 40;
  const SPACING = 40;

  const svg = SvgElCreator.appendSvg(dom);
  for (let i = 0; i < blocks.length; i++) {
    let y = MARGIN_TOP
    for (let j = 0; j < blocks[i].length; j++) {
      const name = blocks[i][j]
      let args = RhineBlock.getBlockToolbox(name)
      if(!(args instanceof Array)) args = undefined
      const block = BaseRender.render(name, svg)
      if(!block) {
        console.error('Block is not found', blocks[i][j])
        continue
      }
      block.view?.setAttribute("transform",
        `translate(${MARGIN_LEFT+i*200},${y})`
      )
      y += block.height + SPACING
    }
  }
}
