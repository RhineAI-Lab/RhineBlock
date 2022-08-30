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
    let vt = MellowValueType.Any
    const type = parseType(valueType);
    if(type.includes('Bool')) vt = MellowValueType.Bool

    const builder =  new PathBuilder()
    const hh = height / 2
    if(vt === MellowValueType.Bool){
      builder.moveTo(x, y, true)
      builder.lineTo(width, 0)
      builder.lineTo(0, height)
      builder.lineTo(-width, 0)
      builder.close()
    }else{
      builder.moveTo(x + hh, y, true)
      builder.lineTo( width - height, 0)
      builder.arcTo(hh, hh, 180, false, true, 0,  height)
      builder.lineTo( height - width, 0)
      builder.arcTo(hh, hh, 180, false, true, 0,  -height)
    }
    return builder
  }
}

enum MellowValueType {
  Any,
  Number,
  String,
  Bool,
}
