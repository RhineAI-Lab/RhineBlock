import Arg, {ArgType, IArg} from "./arg.class";
import {RhineBlock} from "../RhineBlock";

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

  static fromJson(data: IBlock): Block {
    let argI = 0;
    const lines = data.lines.map(line => {
      return line.map(arg => {
        if (arg.text !== undefined) arg.type = ArgType.Text;
        const id = arg.type === ArgType.Text ? -1 : argI++;
        return Arg.fromJson(id, arg);
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

  setArgs(contents: ToolboxArg[]): void {
    if (!contents) return
    try {
      this.mapValueArgs((arg, id, i, j) => {
        const content = contents[id];
        console.log(arg, content)
        if (typeof content === 'object') {
          const blockData = RhineBlock.getBlockData(content.block)
          if (!blockData) {
            console.error('Block is not register', content.block)
            return
          }
          if (arg.type === ArgType.Value && blockData.type === BlockType.Output) {
            arg.content = Block.fromJson(blockData)
          } else if (
            arg.type === ArgType.Statement && (
              blockData.type === BlockType.Statement ||
              blockData.type === BlockType.Finish
            )
          ) {
            arg.content = Block.fromJson(blockData)
          } else {
            console.error('Block type is not match', arg.valueType, blockData.type)
          }
        } else {

        }
      })
    } catch (e) {
      console.error('Args is invalid for this block', e)
    }
  }

  getArgs(): ToolboxArg[] {
    return []
  }

}

// 图形块类型
export enum BlockType {
  Statement,
  Output,
  Hat,
  Single,
  Start,
  Finish,
  HatSingle,
}

// 图形块申明接口
export interface IBlock {
  name: string;
  type?: BlockType;
  lines: IArg[][];
  output?: string | null;
  color?: string;
  toolbox?: ToolboxArg[] | boolean;
}

// 内容类型
export type ToolboxArg = string | number | boolean | ToolboxArgBlock;

// 图形内容
export interface ToolboxArgBlock {
  block: string;
  shadow?: boolean;
  args?: ToolboxArg[];
}

