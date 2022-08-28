import Block from "../block/block.class";
import SvgElCreator, {transformEl} from "../utils/svg-el-creator";
import BaseRender from "../render/base/base-render";
import Arg from "../block/arg.class";


export default class DragManager {
  static DRAG_VIEW_ID = 'rb-drag-view'

  static dragBlock: Block | null = null;
  static inputs: InputPuzzle[] = []

  static offset: number[] = [0, 0]
  static dragView: SVGElement | null = null;

  static onDragBlockDown(block: Block, e: MouseEvent) {
    const svg = this.newDragView()
    BaseRender.render(block.clone(), svg)
    const rect = (e.target as SVGPathElement).getBoundingClientRect()
    this.offset = [e.clientX - rect.x, e.clientY - rect.y]

    const onDragBlockMove = (e: MouseEvent) => this.onDragBlockMove(e)
    const onDragBlockUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', onDragBlockMove)
      document.removeEventListener('mouseup', onDragBlockUp)
      this.onDragBlockUp(e)
    }
    onDragBlockMove(e)
    document.addEventListener('mousemove', onDragBlockMove)
    document.addEventListener('mouseup', onDragBlockUp)
    e.stopPropagation()
  }

  static onDragBlockMove(e: MouseEvent) {
    if(!this.dragView) return

    const svg = this.dragView
    svg.style.top = `${e.clientY - this.offset[1]}px`
    svg.style.left = `${e.clientX - this.offset[0]}px`
  }
  static onDragBlockUp(e: MouseEvent) {
    DragManager.clearDragView()
  }

  static newDragView(): SVGElement {
    this.clearDragView()
    const holder = document.createElement('div')
    document.body.appendChild(holder)
    holder.id = this.DRAG_VIEW_ID
    holder.classList.add('rb-drag-view')
    SvgElCreator.appendSvg(holder, true)
    this.dragView = holder.children[0] as SVGElement
    return this.dragView
  }

  static clearDragView() {
    document.getElementById(this.DRAG_VIEW_ID)?.remove()
    this.dragView = null
    this.dragBlock = null
  }
}

interface InputPuzzle {
  block: Block,
  arg: Arg,

}


