import Block, {Item} from "../../block/block.class";
import BaseRender from "../../render/base/base-render";
import {RhineBlock} from "../../RhineBlock";
import SvgElCreator, {transformEl} from "../../utils/svg-el-creator";

import "../../../blocks/event.block";
import "../../../blocks/equipment.block";
import "../../../blocks/loop.block"
import "../../../blocks/logic.block"
import "../../../blocks/number.block"
import "../../../blocks/text.block"
import "../../../blocks/console.block"

export default function renderFlyout(dom: HTMLElement, blocks: string[][]) {

  const MARGIN_LEFT = 40;
  const MARGIN_TOP = 40;
  const SPACING = 40;

  const svg = SvgElCreator.appendSvg(dom);
  for (let i = 0; i < blocks.length; i++) {
    let y = MARGIN_TOP
    for (let j = 0; j < blocks[i].length; j++) {
      const item: Item = {
        block: blocks[i][j],
      }
      const block = Block.fromItem(item, null, true)
      BaseRender.render(block, svg)
      block.setPosition(MARGIN_LEFT + j * SPACING, y)
      y += block.height + SPACING
    }
  }
}
