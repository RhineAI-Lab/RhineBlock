import Block from "../../block/block.class";
import PathBuilder from "../../utils/path-builder";

export class ShapeProvider{

  CORNER_SIZE = 4

  PUZZLE_HEIGHT = 6
  PUZZLE_WIDTH = 4

  makeTopLeftCorner(): string{
    return new PathBuilder()
      .lineTo(this.CORNER_SIZE, -this.CORNER_SIZE)
      .build()
  }

  makeBottomLeftCorner(): string{
    return new PathBuilder()
      .lineTo(-this.CORNER_SIZE, -this.CORNER_SIZE)
      .build()
  }

}
