import Arg, {ArgType, IArg} from "./arg.class";

export default class Block {

  view: SVGElement | null = null;
  width: number = 0;
  height: number = 0;

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

  hadStatementInLine(i: number): boolean {
    return this.lines[i].some(arg => arg.type === ArgType.Statement)
  }

  mapArgs(fn: (arg: Arg, i: number, j: number) => void): void {
    this.lines.forEach((line, i) => {
      line.forEach((arg, j) => {
        fn(arg, i, j);
      })
    })
  }

  mapValueArgs(fn: (arg: Arg, id: number, i: number, j: number) => void): void {
    this.lines.forEach((line, i) => {
      line.forEach((arg, j) => {
        if (arg.type !== ArgType.Text) {
          fn(arg, arg.id, i, j)
        }
      })
    })
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

