import Block from "../../block/block.class";

export class BaseRender {
  static render(block: Block): SVGGElement {

    const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    el.setAttribute('class', 'blockHolder');

    const background = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    background.setAttribute('class', 'blockBackground');
    background.setAttribute('fill', block.color);
    background.setAttribute('d', 'M 0 0 h 100 v 100 h -100 z');

    el.appendChild(background);

    return el
  }

  static makeBodyPath(block: Block): string {
    return ''
  }
}
