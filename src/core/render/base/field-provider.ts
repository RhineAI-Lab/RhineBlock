import SvgElCreator from "./svg-el-creator";

export default class FieldProvider {

  static FIELD_RADIUS = 4;
  static FIELD_TEXT_COLOR = '#000000' // 文本颜色
  static FIELD_TEXT_SIZE = 14
  static FIELD_BACKGROUND = '#ffffffaa' // 背景颜色

  static FIELD_PADDING_HORIZONTAL = 5
  static FIELD_PADDING_VERTICAL = 0

  static makeTextInput(
    text: string,
    parent: SVGElement,
    onChange: (text: string) => void
  ): SVGElement {
    const el = SvgElCreator.newGroup({
      class: 'rb-field rb-field-input'
    })
    parent.appendChild(el)
    const textEl = SvgElCreator.newText(
      text,
      this.FIELD_PADDING_HORIZONTAL,
      this.FIELD_PADDING_VERTICAL,
      this.FIELD_TEXT_SIZE,
      this.FIELD_TEXT_COLOR
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
