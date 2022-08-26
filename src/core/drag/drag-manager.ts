import Block from "../block/block.class";
import SvgElCreator, {transformEl} from "../utils/svg-el-creator";
import BaseRender from "../render/base/base-render";

let offset: number[] = [0, 0]
let dragView: HTMLDivElement | null = null;

export default class DragManager {
  DRAG_VIEW_ID = 'rb-drag-view'

  dragBlock: Block | null = null;

  onDragBlock(block: Block, e: MouseEvent) {
    const svg = this.newDragView().children[0] as SVGSVGElement
    BaseRender.render(block.clone(), svg)
    const rect = (e.target as SVGPathElement).getBoundingClientRect()
    offset = [e.clientX - rect.x, e.clientY - rect.y]
    onDragBlockMove(e)
    document.addEventListener('mousemove', onDragBlockMove)
    document.addEventListener('mouseup', onDragBlockUp)
    e.stopPropagation()
  }

  newDragView(): HTMLDivElement {
    this.clearDragView()
    const holder = document.createElement('div')
    document.body.appendChild(holder)
    holder.id = this.DRAG_VIEW_ID
    holder.classList.add('rb-drag-view')
    SvgElCreator.appendSvg(holder, true)
    dragView = holder
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
  if(dragView && dragView.children[0]) {
    const svg = dragView.children[0] as SVGSVGElement
    svg.style.top = `${e.clientY - offset[1]}px`
    svg.style.left = `${e.clientX - offset[0]}px`
  }
}

function onDragBlockUp(e: MouseEvent) {
  document.removeEventListener('mousemove', onDragBlockMove)
  document.removeEventListener('mouseup', onDragBlockUp)
  DragManagerInstance.clearDragView()
}


