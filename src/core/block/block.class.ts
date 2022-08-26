import Arg, {ArgType, IArg} from "./arg.class";
import {RhineBlock} from "../RhineBlock";

export default class Block {

  view: SVGElement | null = null;
  width: number = 0;
  height: number = 0;

  previous: Block | null = null;
  next: Arg = Arg.fromJson(-1, {type: ArgType.Statement});

  isRoot: boolean = false; // 是否为根元素
  x: number = 0;
  y: number = 0;
  isShadow: boolean = false;

  constructor(
    public name: string,
    public type: BlockType,
    public lines: Arg[][],
    public output: string | null,
    public color: string,
  ) {
  }

  static fromJson(data: IBlock, args: ItemValue[] | null = null): Block {
    let argI = 0;
    const lines = data.lines.map(line => {
      return line.map(arg => {
        if (arg.text !== undefined) arg.type = ArgType.Text;
        const id = arg.type === ArgType.Text ? -1 : argI++;
        return Arg.fromJson(id, arg);
      })
    })
    const block = new Block(
      data.name,
      data.type ? data.type : BlockType.Statement,
      lines,
      data.output ? data.output : null,
      data.color ? data.color : '#329eff',
    )
    if(args) {
      block.setArgsFromJson(args);
    }
    return block
  }

  hadHat(): boolean {
    return this.type === BlockType.HatSingle || this.type === BlockType.Hat
  }

  hadNext(): boolean {
    return this.type !== BlockType.Single && this.type !== BlockType.Finish
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

  setArgsFromJson(contents: ItemValue[]): void {
    if (!contents) return
    try {
      // 设置所有内部参数
      this.mapValueArgs((arg, id, i, j) => {
        const content = contents[id];
        if(!content) return
        if (typeof content === 'object') {
          if(content.next) return;
          const blockData = RhineBlock.getBlockData(content.block)
          if (!blockData) {
            console.error('Block is not register', content.block)
            return
          }
          if (arg.type === ArgType.Value && blockData.type === BlockType.Output) {
            arg.content = Block.fromJson(blockData)
            if(content.args) arg.content.setArgsFromJson(content.args)
          } else if (
            arg.type === ArgType.Statement && (
              blockData.type === BlockType.Statement ||
              blockData.type === BlockType.Finish
            )
          ) {
            arg.content = Block.fromJson(blockData)
            if(content.args) arg.content.setArgsFromJson(content.args)
          } else {
            console.error('Block type is not match', arg.valueType, blockData.type)
          }
        } else {
          arg.content = content
        }
      })
      // 设置下方参数
      const content = contents[contents.length - 1]
      if(content && typeof content === 'object' && content.next) {
        const blockData = RhineBlock.getBlockData(content.block)
        if (!blockData) {
          console.error('Block is not register', content.block)
        } else {
          this.next.content = Block.fromJson(blockData)
          this.next.content.previous = this
          if(content.args) this.next.content.setArgsFromJson(content.args)
        }
      }
    } catch (e) {
      console.error('Args is invalid for this block', e)
    }
  }

  getArgs(): Item {
    const contents: ItemValue[] = []
    this.mapValueArgs((arg, id, i, j) => {
      if(arg.type === ArgType.Statement || arg.type === ArgType.Value) {
        contents.push(arg.content.getArgs())
      }else{
        contents.push(arg.content)
      }
    });
    if(this.next.content) {
      contents.push(this.next.content.getArgs())
      // @ts-ignore
      contents[contents.length - 1].next = true
    }
    const item: Item = {
      block: this.name,
      args: contents,
    }
    if(this.isShadow) item.shadow = true
    return item
  }
  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
    this.view?.setAttribute('transform', `translate(${x}, ${y})`)
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

  toolbox?: ItemValue[] | boolean;
}


// 内容类型
export type ItemValue = string | number | boolean | null | Item;

// 图形内容
export interface Item {
  block: string;
  args?: ItemValue[];

  next?: boolean; // 是否为下行属性
  shadow?: boolean; // 是否为阴影块
}

// 根图形块内容
export interface RootItem extends Item {
  x: number;
  y: number;
}

