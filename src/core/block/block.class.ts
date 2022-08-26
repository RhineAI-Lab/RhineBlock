import Arg, {ArgType, IArg} from "./arg.class";
import {RhineBlock} from "../RhineBlock";
import BaseRender from "../render/base/base-render";

export default class Block {

  view: SVGElement | null = null;
  width: number = 0;
  height: number = 0;

  next: Arg = Arg.fromJson(-1, {type: ArgType.Statement});
  parent: Block | null = null;
  previous: Block | null = null;

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

  static fromItem(item: Item, parent: Block | null = null, toolboxMode: boolean = false): Block {
    let data = RhineBlock.getBlockData(item.block)
    if (!data) {
      console.error('Block is not register', item.block)
      data = RhineBlock.getBlockData('unknown')!
    }
    if(toolboxMode) {
      item.args = typeof data.toolbox !== "boolean" ? data.toolbox : []
    }
    return Block.fromDataAndArgs(data, item.args, parent)
  }

  private static fromDataAndArgs(data: IBlock, args: ItemValue[] | null = null, parent: Block | null = null): Block {
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
    block.parent = parent
    if(args) {
      block.setArgsFromJson(args);
    }
    return block
  }

  clone(): Block {
    const data = RhineBlock.getBlockData(this.name)!
    return Block.fromDataAndArgs(data, this.getItem().args)
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

  setArgFromItem(item: Item, id: number, parent: Block | null = null): void {
    const arg = this.getArg(id)
    if (!arg) return
  }

  setArgsFromJson(contents: ItemValue[], parent: Block | null = null): void {
    if (!contents) return
    try {
      // 设置所有内部参数
      this.mapValueArgs((arg, id) => {
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
            arg.content = Block.fromDataAndArgs(blockData, [], parent)
            if(content.args) arg.content.setArgsFromJson(content.args)
          } else if (
            arg.type === ArgType.Statement && (
              blockData.type === BlockType.Statement ||
              blockData.type === BlockType.Finish
            )
          ) {
            arg.content = Block.fromDataAndArgs(blockData, [], parent)
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
          this.next.content = Block.fromDataAndArgs(blockData, [], parent)
          this.next.content.previous = this
          if(content.args) this.next.content.setArgsFromJson(content.args)
        }
      }
    } catch (e) {
      console.error('Args is invalid for this block', e)
    }
  }

  getArg(id: number): Arg | null {
    for (const line of this.lines) {
      for (const arg of line) {
        if (arg.id === id) return arg
      }
    }
    return null
  }

  getItem(): Item {
    const contents: ItemValue[] = []
    this.mapValueArgs((arg, id, i, j) => {
      if(arg.type === ArgType.Statement || arg.type === ArgType.Value) {
        if(arg.content) {
          contents.push((arg.content as Block).getItem())
        }
      }else{
        contents.push((arg.content as Block).getItem())
      }
    });
    if(this.next.content) {
      contents.push((this.next.content as Block).getItem())
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

