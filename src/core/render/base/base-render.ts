import Block from "../../block/block.class";
import PathBuilder from "../../utils/path-builder";
import {ArgType} from "../../block/arg.class";
import './base-render.css'
import {ShapeProvider} from "./shape-provider";

export default class BaseRender {
  static provider = new ShapeProvider()

  static PADDING = 5;
  static MIN_WIDTH = 100;
  static LINE_HEIGHT = 30;

  static CONTENT_SPACING = 4;
  static TEXT_COLOR = '#ffffff'

  static FONT_SIZE = 14;
  static TEXT_LINE_HEIGHT = 14;

  static render(block: Block, svg: SVGGElement): SVGGElement {

    const el = this.newGroup({
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
          svgEl = this.newText(arg.text, currentX, currentY + this.TEXT_LINE_HEIGHT, this.TEXT_COLOR);
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

    const width = Math.max(...linesWidth)
    const height = sum(linesHeight)

    const builder = new PathBuilder()
      .moveTo(this.provider.CORNER_SIZE, 0, true)
      .horizontalTo(width - this.provider.CORNER_SIZE)
      .verticalTo(height)
      .horizontalTo(-width + this.provider.CORNER_SIZE)
      .pushPath(this.provider.makeBottomLeftCorner())
      .verticalTo(-height + this.provider.CORNER_SIZE * 2)
      .pushPath(this.provider.makeTopLeftCorner())
      .close()
    let bodyPath = builder.build() + ' ' + innerPath.join(' ')

    const background = this.newPath(bodyPath, block.color, 'none');
    background.setAttribute('class', 'rb-block-body');

    appendChildToFirst(el, background);

    return el
  }

  static newPath(path: string, color: string = '#888888', stroke: string = 'none'): SVGPathElement {
    return this.newSvgElement('path', {
      d: path,
      fill: color,
      stroke: stroke,
      'fill-rule': 'evenodd',
    }) as SVGPathElement;
  }

  static newText(text: string, x: number, y: number, color: string = '#ffffff'): SVGTextElement {
    const el = this.newSvgElement('text', {
      x: x.toString(),
      y: y.toString(),
      fill: color,
      'font-size': this.FONT_SIZE + 'px',
    }) as SVGTextElement;
    el.textContent = text;
    return el;
  }

  static newGroup(attributes: { [key: string]: string }): SVGGElement {
    return this.newSvgElement('g', attributes) as SVGGElement;
  }

  static newSvgElement(tag: string, attributes: { [key: string]: string }): SVGElement {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
    return el;
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
