import Block, {BlockType} from "../../block/block.class";
import PathBuilder, {PLine} from "../../utils/path-builder";
import Arg, {ArgType} from "../../block/arg.class";
import './base-render.css'
import {ShapeProvider} from "./shape-provider";
import SvgElCreator from "./svg-el-creator";
import {adjustColorBright} from "../../utils/color";

export default class BaseRender {
  // 细节形状提供器
  static provider = new ShapeProvider()

  // 整图形块参数
  static MIN_WIDTH = 36; // 最小宽度
  static MIN_LINE_HEIGHT = 28; // 每行最小高度
  static PADDING_VERTICAL = 5; // 每行垂直边距
  static PADDING_VERTICAL_VL = 5; // 当此行有VALUE输入时 额外增加垂直边距高度
  static PADDING_HORIZONTAL = 7; // 图形块水平边距
  static CONTENT_SPACING = 4; // 行内内容之间间距

  // 文本参数
  static TEXT_COLOR = '#ffffff' // 文本颜色
  static FONT_SIZE = 14; // 字体大小
  static TEXT_LINE_HEIGHT = 16; // 文本行高

  // 输入图形块大小
  static MIN_VALUE_WIDTH = 36 // 最小VALUE块宽度
  static MIN_VALUE_HEIGHT = this.MIN_LINE_HEIGHT // 最小VALUE块高度

  // 阴影效果
  static SHADOW_STROKE = 1.2
  static SHADOW_COLORS = [0, -24, 32]
  static SHADOW_POSITIONS = [[0, 0], [1, 1], [0, -1]]

  static render(block: Block, parent: SVGElement): SVGElement {
    // 创建图形块根元素
    const el = SvgElCreator.newGroup({
      class: 'rb-block-holder'
    })
    parent.appendChild(el)

    this.renderView(block, el)
    this.renderPositionCalculate(block, el)
    const bodyPath = this.renderBodyPath(block, el)

    // 添加图形块阴影
    for (const i in this.SHADOW_COLORS) {
      const body = SvgElCreator.newPath(bodyPath, adjustColorBright(block.color, this.SHADOW_COLORS[i]), 'none');
      if (i === '0') {
        body.classList.add('rb-block-body')
      } else {
        body.style.transform = `translate(${this.SHADOW_POSITIONS[i][0]}px, ${this.SHADOW_POSITIONS[i][1]}px)`
      }
      appendChildToFirst(el, body);
    }

    return el
  }

  // 渲染出所有内部元素并记录所有元素宽高。
  // 当有内部拼接图形块时，进行递归，计算全部宽高。
  static renderView(block: Block, parent: SVGElement): void {
    block.mapArgs((arg, i, j) => {
      let el: SVGElement | null = null;
      if (arg.type === ArgType.Text) {
        el = SvgElCreator.newText(arg.text, 0, 0, this.FONT_SIZE, this.TEXT_COLOR);
      } else if (arg.type === ArgType.Field) {

      } else if (arg.type === ArgType.Statement) {
        if (arg.value) {
          el = this.render(arg.value, parent)
        } else {
          arg.w = this.MIN_VALUE_WIDTH
          arg.h = this.MIN_VALUE_HEIGHT
        }
      } else if (arg.type === ArgType.Value) {
        if (arg.value) {
          el = this.render(arg.value, parent)
        } else {
          arg.w = this.MIN_VALUE_WIDTH
          arg.h = this.MIN_VALUE_HEIGHT
        }
      }
      if (el != null) {
        parent.appendChild(el)
        arg.view = el
        let rect = el.getBoundingClientRect()
        arg.w = rect.width
        arg.h = rect.height
      }
    })
  }

  static linesWidth: number[] = []
  static linesHeight: number[] = []
  static statementsX: number[] = []

  // 计算所有参数对应位置
  static renderPositionCalculate(block: Block, parent: SVGElement): void {
    this.linesWidth = []
    this.linesHeight = []
    // 计算每行宽度及高度
    for (let i = 0; i < block.lines.length; i++) {
      let height = this.MIN_LINE_HEIGHT - this.PADDING_VERTICAL * 2
      for (let j = 0; j < block.lines[i].length; j++) {
        const arg = block.lines[i][j]
        if (arg.h > height) {
          height = arg.h
        }
      }
      this.linesHeight.push(height + this.PADDING_VERTICAL * 2)
    }
    // 计算每个元素具体位置
    let startX = this.PADDING_HORIZONTAL
    if (block.type === BlockType.Output) startX += this.provider.TAB_WIDTH
    let y = 0
    if (block.type === BlockType.Hat) y += this.provider.HAT_HEIGHT
    for (let i = 0; i < block.lines.length; i++) {
      let h = this.linesHeight[i]
      let x = startX
      for (let j = 0; j < block.lines[i].length; j++) {
        const arg = block.lines[i][j]
        arg.x = x
        arg.y = y + (h - arg.h) / 2
        arg.updateViewPosition()
        x += arg.w + this.CONTENT_SPACING
      }
      this.linesWidth.push(x + this.PADDING_HORIZONTAL - this.CONTENT_SPACING)
      y += h
    }
  }

  // 计算图形块主体路径
  static renderBodyPath(block: Block, parent: SVGElement): string {
    const width = Math.max(this.MIN_WIDTH, ...this.linesWidth)
    const height = sum(this.linesHeight)

    const builder = new PathBuilder()
    if (block.type === BlockType.Output) {
      builder.pushPath(this.makeValuePath(0, 0, width, height, []).getPath(false))
    } else {
      if (block.hadHat()) {
        builder.moveTo(0, this.provider.HAT_HEIGHT, true)
        builder.pushPath(this.provider.makeHat())
        builder.horizontalTo(width - this.provider.HAT_WIDTH)
      } else if (block.type === BlockType.Start || block.type === BlockType.Single) {
        builder.moveTo(0, this.provider.CORNER_SIZE, true)
        builder.pushPath(this.provider.makeTopLeftCorner())
        builder.horizontalTo(width - this.provider.CORNER_SIZE)
      } else {
        builder.moveTo(0, this.provider.CORNER_SIZE, true)
        builder.pushPath(this.provider.makeTopLeftCorner())
        builder.pushPath(this.makePuzzleLine(width))
      }
      builder.verticalTo(height)
      if (block.type === BlockType.Finish || block.type === BlockType.Single) {
        builder.horizontalTo(-width + this.provider.CORNER_SIZE)
      } else {
        builder.pushPath(this.makePuzzleLine(width, true))
      }
      builder.pushPath(this.provider.makeBottomLeftCorner(true))
      builder.close()
    }
    block.mapValueArgs((arg, id, i, j) => {
      if (arg.type === ArgType.Value) {
        builder.pushPath(this.makeValuePath(arg.x, arg.y, arg.w, arg.h, []).getPath())
      }
    })
    return builder.build()
  }


  // 绘制内部拼接路径边框
  static makeValuePath(x: number = 0, y: number = 0, width: number = this.MIN_VALUE_WIDTH, height: number = this.MIN_VALUE_HEIGHT, rightLine: PLine[] = []): PathBuilder {
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
