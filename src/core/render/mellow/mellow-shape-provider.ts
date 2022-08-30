import Block from "../../block/block.class";
import PathBuilder, {PLine} from "../../utils/path-builder";
import {ShapeProvider} from "../base/shape-provider";

export class MellowShapeProvider extends ShapeProvider{

  CORNER_SIZE = 4 // 边角大小

  SEAT_HEIGHT = 8 // 占位行高度

  PUZZLE_LEFT = 14 // 上下拼图距左侧距离(相对图形块)
  PUZZLE_WIDTH = 18 // 上下拼图宽度
  PUZZLE_HEIGHT = 4 // 上下拼图高度

  TAB_TOP = 4 // 左右拼图距顶部距离(相对图形块)
  TAB_WIDTH = 6 // 左右拼图宽度
  TAB_HEIGHT = 15 // 左右拼图高度

  HAT_WIDTH = 76 // 帽子宽度
  HAT_HEIGHT = 10 // 帽子高度

  makeTopLeftCorner(reverse: boolean = false, isRect: boolean = false): PLine[]{
    if(isRect){
      return new PathBuilder()
        .verticalTo(-this.CORNER_SIZE)
        .horizontalTo(this.CORNER_SIZE)
        .getPath(reverse)
    }else{
      return new PathBuilder()
        .lineTo(this.CORNER_SIZE, -this.CORNER_SIZE)
        .getPath(reverse)
    }
  }

  makeBottomLeftCorner(reverse: boolean = false, isRect: boolean = false): PLine[]{
    if(isRect){
      return new PathBuilder()
        .verticalTo(this.CORNER_SIZE)
        .horizontalTo(this.CORNER_SIZE)
        .getPath(reverse)
    }else{
      return new PathBuilder()
        .lineTo(this.CORNER_SIZE, this.CORNER_SIZE)
        .getPath(reverse)
    }
  }

  makeTab(reverse: boolean = false): PLine[]{
    const MR = 3
    return new PathBuilder()
      .verticalTo(MR)
      .lineTo(-this.TAB_WIDTH, -MR)
      .verticalTo(this.TAB_HEIGHT)
      .lineTo(this.TAB_WIDTH, -MR)
      .verticalTo(MR)
      .getPath(reverse)
  }

  makePuzzle(reverse: boolean = false): PLine[]{
    return new PathBuilder()
      .lineTo(this.PUZZLE_HEIGHT, this.PUZZLE_HEIGHT)
      .horizontalTo(this.PUZZLE_WIDTH - this.PUZZLE_HEIGHT * 2)
      .lineTo(this.PUZZLE_HEIGHT, -this.PUZZLE_HEIGHT)
      .getPath(reverse)
  }

  makeHat(reverse: boolean = false): PLine[]{
    return new PathBuilder()
      .arcTo(this.HAT_WIDTH, this.HAT_HEIGHT*9, 180, false, true, this.HAT_WIDTH, 0)
      .getPath(reverse)
  }

}
