import Arg, {IArg} from "./arg.class";

export default class Block {

  constructor(
    public name: string,
    public type: BlockType,
    public lines: Arg[][],
    public output: string | null,
    public color: string,
  ) {
  }

  static fromJson(data: IBlock, theme: any): Block {
    let argI = 0;
    const lines = data.lines.map(line => {
      return line.map(arg => {
        return Arg.fromJson(argI, arg);
      })
    })
    return new Block(
      data.name,
      data.type ? data.type : BlockType.Statement,
      lines,
      data.output ? data.output : null,
      data.color ? data.color : '#329eff',
    )
  }

  hadHat(): boolean {
    return this.type == BlockType.HatSingle || this.type == BlockType.Hat
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
  lines: IArg[][];
  output?: string | null;
  color?: string;
  toolbox?: DefaultArg[] | boolean;
}

export type DefaultArgValue = string | number | boolean | Array<DefaultArg>;

export interface DefaultArg {
  id?: number;
  name: string;
  value?: DefaultArgValue;
}

