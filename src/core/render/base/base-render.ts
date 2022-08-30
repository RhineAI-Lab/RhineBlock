import Block, {BlockType, OpacityType} from "../../block/block.class";
import PathBuilder, {PLine} from "../../utils/path-builder";
import Arg, {ArgType, FieldType} from "../../block/arg.class";
import './base-style.css'
import {ShapeProvider} from "./shape-provider";
import SvgElCreator from "../../utils/svg-el-creator";
import {adjustColorBright} from "../../utils/color-adjust";
import FieldProvider from "./field-provider";
import {sourceType} from "./type-parse";

export default class BaseRender {
  // 细节形状提供器
  static provider = new ShapeProvider()
  static fieldProvider = new FieldProvider()

  // 整图形块参数
  static MIN_WIDTH = 36; // 最小宽度
  static MIN_LINE_HEIGHT = 28; // 每行最小高度
  static PADDING_VERTICAL = 5; // 每行垂直边距
  static PADDING_VERTICAL_VL = 5; // 当此行有VALUE输入时 额外增加垂直边距高度
  static PADDING_HORIZONTAL = 6; // 图形块水平边距
  static CONTENT_SPACING = 4; // 行内内容之间间距

  // 半透明度值
  static OPACITY_BODY = 0.28;
  static OPACITY_SHADOW = 0.1;
  static OPACITY_CONTENT = 0.32;

  // 输入图形块大小
  static MIN_STATEMENT_WIDTH = 36 // 最小STATEMENT宽度
  static MIN_STATEMENT_LEFT = 20 // 最小图形块左侧距离
  static MIN_VALUE_WIDTH = 36 // 最小VALUE块宽度
  static MIN_VALUE_HEIGHT = this.MIN_LINE_HEIGHT // 最小VALUE块高度

  // 阴影效果
  static SHADOW_COLORS = [0, -40, 30]
  static SHADOW_POSITIONS = [[0, 0], [1, 1], [0, -1]]
  static SHADOW_BIAS = 1;

  static render(block: Block, parentEl: SVGElement): SVGElement {
    if (block.view) block.view.remove()
    // 创建图形块根元素
    const el = SvgElCreator.newGroup({
      class: 'rb-block-holder'
    })
    parentEl.appendChild(el)
    block.view = el

    this.renderView(block, el)
    this.freshViewSize(block)
    this.renderPositionCalculate(block)
    const bodyPath = this.makeBodyPath(block)

    this.renderBody(bodyPath, block, el)

    return el
  }

  // 块整体重渲染
  static rerender(block: Block) {
    while (block.parent) block = block.parent
    this.rerenderBlock(block)
  }

  // 局部重渲染
  static rerenderBlock(block: Block) {
    if (!block.view) block.view = SvgElCreator.newGroup({
      class: 'rb-block-holder'
    })
    const el = block.view
    block.mapArgs((arg: Arg) => {
      if (arg.isBlockType()) {
        if (arg.content) {
          if (!arg.view) {
            arg.view = this.render(arg.content as Block, el)
          }
          const content = arg.content as Block
          this.rerenderBlock(content)
        }
      }
    })
    this.freshViewSize(block)
    this.renderPositionCalculate(block)
    const bodyPath = this.makeBodyPath(block)
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as SVGElement
      if (child.classList.contains('rb-block-body') || child.classList.contains('rb-block-body-shadow')) {
        child.setAttribute('d', bodyPath)
      }
    }
  }

  // 渲染主体块
  static renderBody(path: string, block: Block, parentEl: SVGElement) {
    const opacity = block.getOpacity()
    for (const i in this.SHADOW_COLORS) {
      const body = SvgElCreator.newPath(path, adjustColorBright(block.color, this.SHADOW_COLORS[i]), 'none');
      if (i === '0') {
        body.classList.add('rb-block-body')
        block.setMouseEvent(body)
      } else {
        body.classList.add('rb-block-body-shadow')
        body.style.transform = `translate(${this.SHADOW_POSITIONS[i][0]}px, ${this.SHADOW_POSITIONS[i][1]}px)`
      }
      body.style.opacity = opacity ? (i === '0' ? this.OPACITY_BODY : this.OPACITY_SHADOW) + '' : '1'
      appendChildToFirst(parentEl, body);
    }
  }


  // 渲染出所有内部元素并记录所有元素宽高。
  // 当有内部拼接图形块时，进行递归，计算全部宽高。
  static renderView(block: Block, parentEl: SVGElement): void {
    const opacity = block.getOpacity()
    block.mapArgs((arg) => {
      let el: SVGElement | null = null;
      if (arg.type === ArgType.Text) {
        el = SvgElCreator.newText(arg.text);
      } else if (arg.type === ArgType.Field) {
        if (arg.fieldType === FieldType.Text) {
          if (!arg.content) arg.content = arg.default
          el = this.fieldProvider.makeTextInput(
            arg.content as string,
            parentEl,
            (text) => {
              arg.content = text
            }
          );
        }
      } else if (arg.type === ArgType.Statement) {
        if (arg.content) {
          el = this.render(arg.content as Block, parentEl)
        }
      } else if (arg.type === ArgType.Value) {
        if (arg.content) {
          el = this.render(arg.content as Block, parentEl)
        }
      }
      if (el != null) {
        if (!arg.isBlockType()) {
          el.style.opacity = opacity ? this.OPACITY_CONTENT + '' : '1'
        }
        parentEl.appendChild(el)
        arg.view = el
      }
    })
  }

  static freshViewSize(block: Block, inner: boolean = false) {
    block.mapArgs((arg: Arg) => {
      if (arg.view) {
        let rect = arg.view.getBoundingClientRect()
        if (arg.type === ArgType.Value) {
          rect.width += this.SHADOW_BIAS
          rect.height += this.SHADOW_BIAS
        }
        arg.w = rect.width
        arg.h = rect.height
      } else if (arg.type === ArgType.Statement) {
        arg.w = this.MIN_STATEMENT_WIDTH
        arg.h = this.MIN_STATEMENT_LEFT
      } else if (arg.type === ArgType.Value) {
        arg.w = this.MIN_VALUE_WIDTH
        arg.h = this.MIN_VALUE_HEIGHT
      }
      if (arg.content && arg.content instanceof Block && arg.isBlockType()) {
        if (inner) {
          this.freshViewSize(arg.content as Block)
        }
      }
    })
  }


  static linesWidth: number[] = []
  static linesHeight: number[] = []
  static statementsX: number[] = []
  static topSeatLine: boolean = false
  static needBottomSeatLine: boolean[] = []

  // 计算所有参数对应位置
  static renderPositionCalculate(block: Block): void {
    // 计算语句输入是否需要上下占位行
    this.needBottomSeatLine = []
    this.topSeatLine = false
    for (let i = 0; i < block.lines.length; i++) {
      this.needBottomSeatLine.push(false)
      if (block.hadStatementInLine(i)) {
        if (i === 0) {
          this.topSeatLine = true
        }
        if (i === block.lines.length - 1 || block.hadStatementInLine(i + 1)) {
          this.needBottomSeatLine[i] = true
        }
      }
    }

    // 计算每行宽度及高度
    this.linesWidth = []
    this.linesHeight = []
    for (let i = 0; i < block.lines.length; i++) {
      let height = this.MIN_LINE_HEIGHT
      for (let j = 0; j < block.lines[i].length; j++) {
        const arg = block.lines[i][j]
        let th = arg.h
        if (arg.type !== ArgType.Statement) {
          th += this.PADDING_VERTICAL * 2
        } else {
          th -= this.provider.PUZZLE_HEIGHT - this.SHADOW_BIAS
        }
        if (th > height) height = th
      }
      this.linesHeight.push(height)
    }

    // 计算每个元素具体位置
    let startX = this.PADDING_HORIZONTAL
    if (block.type === BlockType.Output) startX += this.provider.TAB_WIDTH
    let y = 0
    if (block.type === BlockType.Hat) y += this.provider.HAT_HEIGHT
    if (this.topSeatLine) y += this.provider.SEAT_HEIGHT
    for (let i = 0; i < block.lines.length; i++) {
      let h = this.linesHeight[i]
      let x = startX
      this.statementsX.push(0)
      for (let j = 0; j < block.lines[i].length; j++) {
        const arg = block.lines[i][j]
        if (arg.type === ArgType.Statement) {
          if (x < this.MIN_STATEMENT_LEFT) x = this.MIN_STATEMENT_LEFT
          this.statementsX[i] = x
          if (j + 1 < block.lines[i].length) console.warn('Statement should be the last argument in a line')
        }

        arg.x = x
        arg.y = y + (h - arg.h) / 2 + this.SHADOW_BIAS
        if (arg.type === ArgType.Statement) arg.updateViewPosition([this.SHADOW_BIAS, this.SHADOW_BIAS])
        else if (arg.type === ArgType.Value) arg.updateViewPosition([this.SHADOW_BIAS, this.SHADOW_BIAS])
        else arg.updateViewPosition()

        if (arg.type === ArgType.Statement) break
        x += arg.w + this.CONTENT_SPACING
      }
      this.linesWidth.push(x + this.PADDING_HORIZONTAL - this.CONTENT_SPACING)
      if (this.needBottomSeatLine[i]) {
        y += this.provider.SEAT_HEIGHT
      }
      y += h
    }
    block.height = y
    block.width = Math.max(this.MIN_WIDTH, ...this.linesWidth)

    // 绘制下方元素
    const arg = block.next
    arg.y = y
    if (arg.content) {
      arg.updateViewPosition([0, this.SHADOW_BIAS * 2])
      block.height += arg.h + this.SHADOW_BIAS * 2
    }
  }


  // 计算图形块主体路径
  static makeBodyPath(block: Block): string {
    // 绘制图形块右侧纵向路径
    const rightBuilder = new PathBuilder()
    const statementW = block.width - Math.max(...this.statementsX) // 共享语句块左边距
    this.linesHeight.map((h, i) => {
      if (block.hadStatementInLine(i)) {
        // const statementW = block.width - this.statementsX[i]  // 独立语句块左边距
        rightBuilder.pushPath(this.makePuzzleLine(statementW, true))
        rightBuilder.pushPath(this.provider.makeTopLeftCorner(true))
        rightBuilder.verticalTo(h - this.provider.CORNER_SIZE * 2)
        rightBuilder.pushPath(this.provider.makeBottomLeftCorner())
        rightBuilder.horizontalTo(statementW - this.provider.CORNER_SIZE)
      } else {
        rightBuilder.verticalTo(h)
      }
      if (this.needBottomSeatLine[i]) {
        rightBuilder.verticalTo(this.provider.SEAT_HEIGHT)
      }
    });

    // 绘制图形块主体路径
    const builder = new PathBuilder()
    if (block.type === BlockType.Output) {
      builder.pushPath(this.makeValuePath(0, 0, block.width, block.height, rightBuilder.getPath(), block.output).getPath(false))
    } else {
      if (block.hadHat()) {
        builder.moveTo(0, this.provider.HAT_HEIGHT, true)
        builder.pushPath(this.provider.makeHat())
        builder.horizontalTo(block.width - this.provider.HAT_WIDTH)
      } else if (block.type === BlockType.Start || block.type === BlockType.Single) {
        builder.moveTo(0, this.provider.CORNER_SIZE, true)
        builder.pushPath(this.provider.makeTopLeftCorner())
        builder.horizontalTo(block.width - this.provider.CORNER_SIZE)
      } else {
        builder.moveTo(0, this.provider.CORNER_SIZE, true)
        builder.pushPath(this.provider.makeTopLeftCorner(false, block.previous != null))
        builder.pushPath(this.makePuzzleLine(block.width))
      }
      if (this.topSeatLine) {
        builder.verticalTo(this.provider.SEAT_HEIGHT)
      }
      builder.pushPath(rightBuilder.getPath())
      if (block.type === BlockType.Finish || block.type === BlockType.Single) {
        builder.horizontalTo(-block.width + this.provider.CORNER_SIZE)
      } else {
        builder.pushPath(this.makePuzzleLine(block.width, true))
      }
      builder.pushPath(this.provider.makeBottomLeftCorner(true, block.next.content != null))
      builder.close()
    }
    block.mapValueArgs((arg, id, i, j) => {
      if (arg.type === ArgType.Value) {
        builder.pushPath(this.makeValuePath(arg.x, arg.y, arg.w, arg.h, [], arg.valueType).getPath())
      }
    })
    return builder.build()
  }

  // 清除图形块内部的透明度参数
  static clearOpacity(block: Block): void {
    block.recurMapBlock(tb => {
      tb.isOpacity = OpacityType.Default
      if (tb.view) {
        const children = tb.view?.children
        for (let i = 0; i < children.length; i++) {
          (children[i] as SVGElement).style.opacity = '1'
        }
      }
    });
  }


  // 绘制数值路径
  static makeValuePath(
    x: number = 0,
    y: number = 0,
    width: number = this.MIN_VALUE_WIDTH,
    height: number = this.MIN_VALUE_HEIGHT,
    rightLine: PLine[] = [],
    valueType: sourceType = 'Any',
  ): PathBuilder {
    return new PathBuilder()
      .moveTo(x + width, y + height, true)
      .horizontalTo(-width + this.provider.TAB_WIDTH)
      .pushPath(this.makeTabLine(height, true))
      .horizontalTo(width - this.provider.TAB_WIDTH)
      .pushPath(rightLine)
      .close()
  }

  // 绘制带上下拼图的水平线
  static makePuzzleLine(width: number, reverse: boolean = false): PLine[] {
    return new PathBuilder()
      .horizontalTo(this.provider.PUZZLE_LEFT - this.provider.CORNER_SIZE)
      .pushPath(this.provider.makePuzzle())
      .horizontalTo(width - this.provider.PUZZLE_WIDTH - this.provider.PUZZLE_LEFT)
      .getPath(reverse)
  }

  // 绘制带左右拼图的垂直线
  static makeTabLine(height: number, reverse: boolean = false): PLine[] {
    return new PathBuilder()
      .verticalTo(this.provider.TAB_TOP)
      .pushPath(this.provider.makeTab())
      .verticalTo(height - this.provider.TAB_HEIGHT - this.provider.TAB_TOP)
      .getPath(reverse)
  }


}

function sum(arr: number[]): number {
  return arr.reduce((prev, curr, idx, arr) => {
    return prev + curr
  })
}

function appendChildToFirst(parent: HTMLElement | SVGElement, child: HTMLElement | SVGElement) {
  if (parent.children.length === 0) {
    parent.appendChild(child)
  } else {
    parent.insertBefore(child, parent.children[0])
  }
}
