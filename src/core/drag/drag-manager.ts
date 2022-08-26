import Block from "../block/block.class";
import SvgElCreator, {transformEl} from "../utils/svg-el-creator";
import BaseRender from "../render/base/base-render";

let offset: number[] = [0, 0]
let dragView: SVGSVGElement | null = null;

export default class DragManager {
  DRAG_VIEW_ID = 'rb-drag-view'

  dragBlock: Block | null = null;

  onDragBlock(block: Block, e: MouseEvent) {
    const svg = this.newDragView()
    BaseRender.render(block.name, svg, block.getArgs().args)
    this.dragBlock = block
    offset = [e.offsetX - block.x, e.offsetY - block.y]
    transformEl(dragView, e.pageX - offset[0], e.pageY - offset[1])
    document.addEventListener('mousemove', onDragBlockMove)
    document.addEventListener('mouseup', onDragBlockUp)
    e.stopPropagation()
  }

  newDragView(): SVGSVGElement {
    this.clearDragView()
    dragView = SvgElCreator.appendSvg(document.body)
    dragView.id = this.DRAG_VIEW_ID
    dragView.classList.add('rb-drag-view')
    return dragView
  }

  clearDragView() {
    document.getElementById(this.DRAG_VIEW_ID)?.remove()
    dragView = null
    this.dragBlock = null
  }
}

export const DragManagerInstance = new DragManager()

function onDragBlockMove(e: MouseEvent) {
  transformEl(dragView, e.pageX - offset[0], e.pageY - offset[1])
}

function onDragBlockUp(e: MouseEvent) {
  document.removeEventListener('mousemove', onDragBlockMove)
  document.removeEventListener('mouseup', onDragBlockUp)
  DragManagerInstance.clearDragView()
}


