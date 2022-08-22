import Block from "../../block/block.class";
import SvgBuilder from "../../utils/svg-builder";

export class BaseRender {
  static render(block: Block): SVGGElement {

    const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    el.setAttribute('class', 'blockHolder');

    const bodyPath = this.makeBodyPath(block);

    const background = this.newPath(bodyPath, block.color, 'none');
    background.setAttribute('class', 'blockBackground');

    el.appendChild(background);

    return el
  }

  static makeBodyPath(block: Block): string {
    const builder = new SvgBuilder()
      .moveTo(0, 0, true)
      .horizontalTo(200)
      .verticalTo(200)
      .horizontalTo(-200)
      .verticalTo(-200)
      .close()
      .moveTo(50, 50, true)
      .horizontalTo(100)
      .verticalTo(100)
      .horizontalTo(-100)
      .verticalTo(-100)
      .close()
    return builder.build();
  }

  static newPath(path: string, color: string = '#888888', stroke: string = 'none'): SVGPathElement {
    return this.newSvgElement('path', {
      d: path,
      fill: color,
      stroke: stroke,
    }) as SVGPathElement;
  }

  static newText(text: string, x: number, y: number, color: string = '#ffffff'): SVGTextElement {
    return this.newSvgElement('text', {
      x: x.toString(),
      y: y.toString(),
      fill: color,
    }) as SVGTextElement;
  }

  static newGroup(attributes: {[key: string]: string}): SVGGElement {
    return this.newSvgElement('g', attributes) as SVGGElement;
  }

  static newSvgElement(tag: string, attributes: {[key: string]: string}): SVGElement {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
    return el;
  }
}
