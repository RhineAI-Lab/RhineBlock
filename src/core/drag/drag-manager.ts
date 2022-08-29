import Block, {Item, OpacityType} from "../block/block.class";
import SvgElCreator from "../utils/svg-el-creator";
import BaseRender from "../render/base/base-render";
import Arg, {ArgType} from "../block/arg.class";
import {RhineBlock} from "../RhineBlock";
import {deepCopy} from "../utils/normal";


export default class DragManager {
  static DRAG_VIEW_ID = 'rb-drag-view'
  static NEAR_DIS = 16

  static dragItem: Item | null = null; // 当前拖拽内容信息
  static inputs: InputPuzzle[] = [] // 当前可拼接接口

  static offset: number[] = [0, 0] // 当前鼠标相对拖拽块左上角的偏移量
  static dragView: SVGElement | null = null; // 当前鼠标拖拽布局

  static current: Block | null = null  // 鼠标移动时当前落点的临时渲染图形块实例

  static onDragBlockDown(block: Block, e: MouseEvent) {
    this.dragItem = block.getItem()

    const svg = this.newDragView()
    BaseRender.render(block.clone(), svg)
    const rect = (e.target as SVGPathElement).getBoundingClientRect()
    this.offset = [e.clientX - rect.x, e.clientY - rect.y]

    block.parent?.setArgFromContent(block, null, true)

    for (const graph of RhineBlock.graphs) {
      graph.mapAllBlocks(tb => {
        if (tb === block) return
        tb.mapBlockArgs(arg => {
          if (!tb.view) return
          if (
            (block.hadOutput() && arg.type === ArgType.Value) ||
            (block.hadPrevious() && arg.type === ArgType.Statement)
          ) {
            const rect = tb.view.getBoundingClientRect()
            // this.log(tb.name, rect.y, arg.y)
            this.inputs.push({
              block: tb,
              arg: arg,
              position: [rect.x + arg.x, rect.y + arg.y],
              temp: undefined,
            })
          }
        })
      })
    }
    this.log(this.inputs)

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
    if (!this.dragView) return
    this.setDragViewPosition(this.getEventBlockPosition(e))

    const position = this.getEventBlockPosition(e)
    let near: InputPuzzle | null = null
    let currentDis = this.NEAR_DIS
    for (const input of this.inputs) {
      const dis = this.getDis(position, input.position)
      if (dis <= currentDis) {
        near = input
        currentDis = dis
      }
    }
    if (near) {
      this.removeDragShadow(near)
      if (near.temp === undefined) {
        if (near.arg.isBlockType() && near.arg.content) {
          near.temp = near.arg.content as Block
        } else {
          near.temp = null
        }
        this.log('SetTemp', near.temp)
        if (this.dragItem) {
          const item: Item = deepCopy(this.dragItem)
          this.log('ReRender', item)
          const hadNext = near.temp && near.arg.type === ArgType.Statement
          near.block.setArgByItem(near.arg, item, !hadNext, true)
          this.current = near.arg.content as Block
          if (hadNext) {
            this.log('SetNext', item)
            let inner = near.arg.content as Block
            while (inner.hadNext() && inner.next.content) {
              inner = inner.next.content as Block
            }
            if (near.temp) near.temp.isOpacity = OpacityType.False
            inner.setArgByBlock(inner.next, near.temp, true)
          }
        } else {
          this.log('Remove', near.block.name)
          near.block.setArgByItem(near.arg, null, true)
        }
      }
    } else {
      this.removeDragShadow()
    }
  }

  static removeDragShadow(expect: InputPuzzle | null = null): void {
    for (const input of this.inputs) {
      if (expect && input === expect) continue
      if (input.temp !== undefined) {
        this.log('RemoveTo', input.block.name, input.temp)
        input.block.setArgByBlock(input.arg, input.temp, true)
        input.temp = undefined
      }
    }
  }

  static onDragBlockUp(e: MouseEvent) {
    DragManager.clearDragView()
    if(this.current) {
      BaseRender.clearOpacity(this.current)
      this.current = null
    }
    this.dragItem = null
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

  // 计算两点之间距离
  static getDis(p1: number[], p2: number[]): number {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2))
  }

  // 设置拖拽块位置
  static setDragViewPosition(position: number[]): void {
    if (!this.dragView) return
    this.dragView.style.left = `${position[0]}px`
    this.dragView.style.top = `${position[1]}px`
  }

  // 清空拖拽布局
  static clearDragView() {
    document.getElementById(this.DRAG_VIEW_ID)?.remove()
    this.dragView = null
  }

  static DEBUG_MODE = true

  static log(...args: any[]) {
    if (this.DEBUG_MODE) console.log(...args)
  }

}

interface InputPuzzle {
  block: Block,
  arg: Arg,
  position: number[],
  temp: Block | null | undefined,
}


