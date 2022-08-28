import Block from "../block/block.class";
import SvgElCreator from "../utils/svg-el-creator";
import BaseRender from "../render/base/base-render";
import Arg, {ArgType} from "../block/arg.class";
import {RhineBlock} from "../RhineBlock";


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

    for (const graph of RhineBlock.graphs) {
      graph.mapAllBlocks(tb => {
        console.log(tb)
        tb.mapBlockArgs(arg => {
          if(
            (block.hadOutput() && arg.type === ArgType.Value) ||
            (block.hadPrevious() && arg.type === ArgType.Statement)
          ) {
            console.log(arg)
            this.inputs.push({
              block: tb,
              arg: arg,
              position: [arg.x, arg.y]
            })
          }
        })
      })
    }
    console.log(this.inputs)

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
    this.setDragViewPosition(this.getEventBlockPosition(e))

  }
  static onDragBlockUp(e: MouseEvent) {
    DragManager.clearDragView()
    this.dragBlock = null
    this.inputs = []
  }

  // 新建拖拽布局
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

  // 通过鼠标点击事件及当前偏差量记录，计算图形块左上坐标。
  static getEventBlockPosition(e: MouseEvent): number[] {
    return [e.clientX - this.offset[0], e.clientY - this.offset[1]]
  }

  // 设置拖拽块位置
  static setDragViewPosition(position: number[]): void {
    if(!this.dragView) return
    this.dragView.style.left = `${position[0]}px`
    this.dragView.style.top = `${position[1]}px`
  }

  // 清空拖拽布局
  static clearDragView() {
    document.getElementById(this.DRAG_VIEW_ID)?.remove()
    this.dragView = null
  }
}

interface InputPuzzle {
  block: Block,
  arg: Arg,
  position: number[],
}


