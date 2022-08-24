export default class SvgElCreator {

  static newPath(path: string, color: string = '#888888', stroke: string = 'none'): SVGPathElement {
    return this.newSvgElement('path', {
      d: path,
      fill: color,
      stroke: stroke,
      'fill-rule': 'evenodd',
    }) as SVGPathElement;
  }

  static newText(text: string, x: number, y: number, fontSize: number = 14, color: string = '#ffffff'): SVGTextElement {
    const el = this.newSvgElement('text', {
      x: x.toString(),
      y: y.toString(),
      fill: color,
      'font-size': fontSize + 'px',
      'dominant-baseline': 'text-before-edge'
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
