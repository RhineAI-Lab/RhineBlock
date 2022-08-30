import Block, {Item} from "../../block/block.class";
import {RhineBlock} from "../../RhineBlock";

import "../../../blocks/event.block";
import "../../../blocks/equipment.block";
import "../../../blocks/loop.block"
import "../../../blocks/logic.block"
import "../../../blocks/number.block"
import "../../../blocks/text.block"
import "../../../blocks/console.block"
import {Graph} from "../graph/graph";

export default function renderFlyout(dom: HTMLElement, blocks: string[][]) {

  const MARGIN_LEFT = 40;
  const MARGIN_TOP = 40;
  const SPACING = 40;
  const COLUMN_WIDTH = 200;

  const graph = new Graph(dom);
  graph.isToolbox = true;
  RhineBlock.registerGraph(graph);

  for (let i = 0; i < blocks.length; i++) {
    let y = MARGIN_TOP
    for (let j = 0; j < blocks[i].length; j++) {
      const item: Item = {
        block: blocks[i][j],
        x: MARGIN_LEFT + i * COLUMN_WIDTH,
        y: y,
      }

      const data = RhineBlock.getBlockData(item.block)
      if(!data) {
        console.error('Block is not register', item.block)
        continue
      }
      if(typeof data.toolbox === "boolean"){
        if(!data.toolbox){
          continue
        }else{
          item.args = []
        }
      }else{
        item.args = data.toolbox
      }

      const n = graph.render([item])
      y += graph.blocks[n-1].height + SPACING
    }
  }
}
