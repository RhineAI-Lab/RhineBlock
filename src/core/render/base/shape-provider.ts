import Block from "../../block/block.class";
import PathBuilder, {PLine} from "../../utils/path-builder";

export class ShapeProvider{

  CORNER_SIZE = 4

  PUZZLE_LEFT = 16
  PUZZLE_HEIGHT = 4
  PUZZLE_WIDTH = 12

  makeTopLeftCorner(reverse: boolean = false): PLine[]{
    return new PathBuilder()
      .lineTo(this.CORNER_SIZE, -this.CORNER_SIZE)
      .getPath(reverse)
  }

  makeBottomLeftCorner(reverse: boolean = false): PLine[]{
    return new PathBuilder()
      .lineTo(this.CORNER_SIZE, this.CORNER_SIZE)
      .getPath(reverse)
  }

  makePuzzle(reverse: boolean = false): PLine[]{
    return new PathBuilder()
      .lineTo(this.PUZZLE_HEIGHT, this.PUZZLE_HEIGHT)
      .horizontalTo(this.PUZZLE_WIDTH - this.PUZZLE_HEIGHT/2)
      .lineTo(this.PUZZLE_HEIGHT, -this.PUZZLE_HEIGHT)
      .getPath(reverse)
  }

}
