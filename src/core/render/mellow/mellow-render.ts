import BaseRender from "../base/base-render";
import {MellowShapeProvider} from "./mellow-shape-provider";
import PathBuilder, {PLine} from "../../utils/path-builder";
import {parseType, sourceType} from "../base/type-parse";

export default class MellowRender extends BaseRender{

  static provider = new MellowShapeProvider();

  // 绘制数值路径
  static makeValuePath(
    x: number = 0,
    y: number = 0,
    width: number = this.MIN_VALUE_WIDTH,
    height: number = this.MIN_VALUE_HEIGHT,
    rightLine: PLine[] = [],
    valueType: sourceType = 'Any',
  ): PathBuilder {
    const builder =  new PathBuilder()
    const type = parseType(valueType);
    return builder
  }
}
