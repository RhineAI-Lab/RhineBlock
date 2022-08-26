import Block from "../block/block.class";
import SvgElCreator, {transformEl} from "../utils/svg-el-creator";
import BaseRender from "../render/base/base-render";

export default class DragManager {
  static DRAG_VIEW_ID = 'rb-drag-view'

  static dragBlock: Block | null = null;
  static offset: number[] = [0, 0]

  static onDragBlock(block: Block, e: MouseEvent) {
    const svg = this.newDragView()
    BaseRender.render(block.name, svg, block.getArgs().args)
    this.dragBlock = block
    this.offset = [e.pageX, e.pageY]
    transformEl(svg, e.pageX - this.offset[0], e.pageY - this.offset[1])
  }

  static newDragView(): SVGSVGElement{
    this.clearDragView()
    const dragView = SvgElCreator.appendSvg(document.body)
    dragView.id = this.DRAG_VIEW_ID
    dragView.classList.add('rb-drag-view')
    return dragView
  }
  static clearDragView(){
    document.getElementById(this.DRAG_VIEW_ID)?.remove()
  }
}


