import Arg, {IArg} from "./arg.class";

export default class Block {
  constructor(
    public name: string,
    public type: BlockType,
    public lines: Array<Array<Arg>>,
    public output: string | null,
    public color: string,
  ) {}

  static fromJson(data: IBlock, theme: any): Block{
    const lines = data.lines.map((line, index) => {
      return line.map((arg, index) => {
        return Arg.fromJson(index, arg);
      })
    })
    return new Block(
      data.name,
      data.type ? data.type : BlockType.Statement,
      lines,
      data.output ? data.output : null,
      data.color ? data.color : '#dc3d68',
    )
  }
}

export enum BlockType {
  Statement,
  Output,
  Hat,
  Single,
  Start,
  Finish,
  HatSingle,
}

export interface IBlock {
  name: string;
  type?: BlockType;
  lines: Array<Array<IArg>>;
  output?: string | null;
  color?: string;
}


