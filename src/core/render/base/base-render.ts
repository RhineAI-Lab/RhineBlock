import Block from "../../block/block.class";
import PathBuilder, {PLine} from "../../utils/path-builder";
import {ArgType} from "../../block/arg.class";
import './base-render.css'
import {ShapeProvider} from "./shape-provider";
import SvgElCreator from "./svg-el-creator";

export default class BaseRender {
  static provider = new ShapeProvider()

  static PADDING = 5;
  static MIN_WIDTH = 48;
  static LINE_HEIGHT = 30;

  static CONTENT_SPACING = 4;
  static TEXT_COLOR = '#ffffff'

  static FONT_SIZE = 14;
  static TEXT_LINE_HEIGHT = 16;

  static render(block: Block, svg: SVGGElement): SVGGElement {

    const el = SvgElCreator.newGroup({
      class: 'rb-block-holder'
    })
    svg.appendChild(el)

    const innerPath: string[] = []

    const linesWidth = [];
    const linesHeight = [];
    const statementsX = []
    let currentY = this.PADDING
    for (const line of block.lines) {
      let lineHeight = this.LINE_HEIGHT;
      let currentX = this.PADDING;
      for (const arg of line) {
        let svgEl = null
        if (arg.type === ArgType.Text) {
          svgEl = SvgElCreator.newText(arg.text, currentX, currentY + this.TEXT_LINE_HEIGHT, this.FONT_SIZE, this.TEXT_COLOR);
        } else if (arg.type === ArgType.Statement) {
          statementsX.push(currentX + this.PADDING)
        } else if (arg.type === ArgType.Field) {

        } else if (arg.type === ArgType.Value) {

        }
        if (svgEl) {
          el.appendChild(svgEl)
          const rect = svgEl.getBoundingClientRect()
          currentX += this.CONTENT_SPACING + rect.width
        }
      }
      currentY += lineHeight
      linesWidth.push(currentX + this.PADDING)
      linesHeight.push(lineHeight);
    }

    const width = Math.max(this.MIN_WIDTH, ...linesWidth)
    const height = sum(linesHeight)

    const builder = new PathBuilder()
      .moveTo(0, this.provider.CORNER_SIZE, true)
      .pushPath(this.makePuzzleLine(width))
      .verticalTo(height)
      .pushPath(this.makePuzzleLine(width, false, true))
      .verticalTo(-height + this.provider.CORNER_SIZE * 2)
      .close()
    let bodyPath = builder.build() + ' ' + innerPath.join(' ')
    console.log(bodyPath)

    const background = SvgElCreator.newPath(bodyPath, block.color, 'none');
    background.setAttribute('class', 'rb-block-body');

    appendChildToFirst(el, background);

    return el
  }

  static makePuzzleLine(width: number, isTop: boolean = true, reverse: boolean = false): PLine[] {
    return new PathBuilder()
      .pushPath(
        isTop ?
          this.provider.makeTopLeftCorner() :
          this.provider.makeBottomLeftCorner()
      )
      .horizontalTo(this.provider.PUZZLE_LEFT - this.provider.CORNER_SIZE)
      .pushPath(this.provider.makePuzzle())
      .horizontalTo(width - this.provider.PUZZLE_WIDTH - this.provider.PUZZLE_LEFT)
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
