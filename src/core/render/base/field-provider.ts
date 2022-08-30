import SvgElCreator from "../../utils/svg-el-creator";

export default class FieldProvider {

  FIELD_RADIUS = 4;
  FIELD_BACKGROUND = '#ffffffaa' // 背景颜色

  FIELD_PADDING_HORIZONTAL = 5
  FIELD_PADDING_VERTICAL = 0

  makeTextInput(
    text: string,
    parent: SVGElement,
    onChange: (text: string) => void
  ): SVGElement {
    const el = SvgElCreator.newGroup({
      class: 'rb-field rb-field-input'
    })
    parent.appendChild(el)
    const textEl = SvgElCreator.newText(
      text,null,
      this.FIELD_PADDING_HORIZONTAL,
      this.FIELD_PADDING_VERTICAL,
    );
    el.style.padding = `${this.FIELD_PADDING_VERTICAL}px ${this.FIELD_PADDING_HORIZONTAL}px`
    el.appendChild(textEl);
    const rect = textEl.getBoundingClientRect();
    const rectEl = SvgElCreator.newRect(
      0,
      0,
      rect.width + this.FIELD_PADDING_HORIZONTAL * 2,
      rect.height + this.FIELD_PADDING_VERTICAL * 2,
      this.FIELD_BACKGROUND,
      this.FIELD_RADIUS
    );
    el.insertBefore(rectEl, textEl);
    return el
  }
}
