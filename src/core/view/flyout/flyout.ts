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
      const data = RhineBlock.getBlockData(blocks[i][j])
      if(!data || data.toolbox === false) continue;

      let block = Block.fromJson(data, true);

      let blockEl = BaseRender.render(block, svg)
      blockEl.setAttribute("transform",
        `translate(${MARGIN_LEFT+i*200},${y})`
      )

      y += block.height + SPACING
    }
  }
}
