import Arg, {ArgType, IArg} from "./arg.class";
import {RhineBlock} from "../RhineBlock";
import DragManager from "../drag/drag-manager";
import {Graph} from "../view/graph/graph";
import {parseType} from "../render/base/type-parse";

export default class Block {

  view: SVGElement | null = null;
  width: number = 0;
  height: number = 0;

  next: Arg = Arg.fromJson(-1, {type: ArgType.Statement});
  previous?: Block
  parent?: Block

  isShadow: boolean = false;
  isOpacity: OpacityType = OpacityType.Default;

  // 仅根元素有以下参数的值
  isRoot: boolean = false; // 是否为根元素
  x: number = 0; // 在画布中的坐标X
  y: number = 0; // 在画布中的坐标Y
  zIndex: number = 1; // 在画布中的层级
  graph: Graph | null = null; // 画布对象

  constructor(
    public name: string,
    public type: BlockType,
    public lines: Arg[][],
    public output: string[],
    public color: string,
  ) {
  }

  static fromItem(item: Item, toolboxMode: boolean = false, parent?: Block): Block {
    let data = RhineBlock.getBlockData(item.block)
    if (!data) {
      console.error('Block is not register', item.block)
      data = RhineBlock.getBlockData('unknown')!
    }
    if (toolboxMode) {
      item.args = typeof data.toolbox !== "boolean" ? data.toolbox : []
    }
    return Block.fromDataAndArgs(data, item.args, parent)
  }

  private static fromDataAndArgs(data: IBlock, args: ItemValue[] | null = null, parent?: Block): Block {
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
      data.output ? parseType(data.output) : [''],
      data.color ? data.color : '#329eff',
    )
    block.parent = parent
    if (args) {
      block.setArgsFromItems(args)
    }
    return block
  }

  isInToolbox(): boolean {
    return Boolean(this.getGraph()?.isToolbox)
  }
  setMouseEvent(body: SVGPathElement): void {
    if(this.getGraph()?.isToolbox){
      if(this.graph){
        this.setOnDragEvent(body)
      }
    }else{
      this.setOnDragEvent(body)
    }
  }
  setOnDragEvent(body: SVGPathElement): void {
    body.onmousedown = (e) => {
      DragManager.onDragBlockDown(this, e, this.isInToolbox())
      return false
    }
  }

  setArgFromContent(content: Block, item: Item | null = null, rerender: boolean = false): void {
    const arg = this.getArgByContent(content)
    if (!arg) return
    this.setArgByItem(arg, item, rerender)
  }

  getArgByContent(content: Block): Arg | void {
    let result = undefined
    this.mapBlockArgs(arg => {
      if (arg.content === content) {
        result = arg
      }
    })
    return result
  }

  mapBlockArgs(fn: (arg: Arg) => boolean | void) {
    this.mapValueArgs(arg => {
      if (arg.isBlockType()) {
        return fn(arg)
      }
    }, true)
  }

  recurMapBlock(fn: (block: Block) => void) {
    fn(this)
    this.mapBlockArgs(arg => {
      if (arg.content) {
        (arg.content as Block).recurMapBlock(fn)
      }
    })
  }

  clearArgs(): void {
    this.mapValueArgs(arg => {
      arg.clear()
    })
  }

  clone(): Block {
    const data = RhineBlock.getBlockData(this.name)!
    return Block.fromDataAndArgs(data, this.getItem().args, this.parent)
  }

  hadHat(): boolean {
    return this.type === BlockType.HatSingle || this.type === BlockType.Hat
  }

  hadNext(): boolean {
    return [BlockType.Hat, BlockType.Statement, BlockType.Start].indexOf(this.type) > -1
  }

  hadPrevious(): boolean {
    return this.type === BlockType.Statement || this.type === BlockType.Finish
  }

  hadOutput(): boolean {
    return this.type === BlockType.Output
  }

  hadStatementInLine(i: number): boolean {
    return this.lines[i].some(arg => arg.type === ArgType.Statement)
  }

  mapArgs(fn: (arg: Arg, i: number, j: number) => boolean | void, next = true): void {
    let breakFlag: boolean | void = false
    this.lines.some((line, i) => {
      line.some((arg, j) => {
        breakFlag = fn(arg, i, j)
        return Boolean(breakFlag)
      })
      return Boolean(breakFlag)
    })
    if (this.hadNext() && this.next && next) {
      fn(this.next, this.lines.length, 0)
    }
  }

  mapValueArgs(fn: (arg: Arg, id: number, i: number, j: number) => boolean | void, next = true): void {
    this.mapArgs(((arg, i, j) => {
      if (arg.type !== ArgType.Text) {
        return fn(arg, arg.id, i, j)
      }
    }), next)
  }

  setArgByItem(arg: Arg, item: ItemValue, rerender: boolean = false, opacity: boolean = false): void {
    if (!item) {
      arg.clear()
    } else if (typeof item === 'object') {
      arg.clear()
      const blockData = RhineBlock.getBlockData(item.block)
      if (!blockData) {
        console.error('Block is not register', item.block)
        return
      }
      if (arg.type === ArgType.Value && blockData.type === BlockType.Output) {
        arg.content = Block.fromDataAndArgs(blockData, item.args, this)
      } else if (
        arg.type === ArgType.Statement && (
          blockData.type === BlockType.Statement ||
          blockData.type === BlockType.Finish
        )
      ) {
        arg.content = Block.fromDataAndArgs(blockData, item.args, this)
        if (opacity) {
          arg.content.isOpacity = OpacityType.True
        }
        if (item.next) {
          if (item.args) arg.content.setArgsFromItems(item.args)
          arg.content.previous = this
        }
      } else {
        return;
      }
      arg.content.parent = this
      if (this.next === arg) {
        arg.content.previous = this
      }
    } else {
      arg.content = item
    }
    if (rerender) {
      // console.log('ReRender', this)
      RhineBlock.Render.rerender(this)
    }
  }

  setArgByBlock(arg: Arg, block: Block | null, rerender: boolean = false): void {
    if (!block) {
      arg.clear()
    } else {
      if (arg.isBlockType()) {
        arg.clear()
        arg.content = block
        arg.content.parent = this
        if (this.next === arg) {
          arg.content.previous = this
        }
      }
    }
    if (rerender) {
      RhineBlock.Render.rerender(this)
    }
  }

  setArgsFromItems(contents: ItemValue[]): void {
    if (!contents) return
    try {
      // 设置所有内部参数
      this.mapValueArgs((arg, id) => {
        const content = contents[id];
        if (!content) return
        this.setArgByItem(arg, content)
      }, false)
      // 设置下方参数
      const content = contents[contents.length - 1]
      if (content && typeof content === 'object' && content.next) {
        this.setArgByItem(this.next, content)
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
    this.mapValueArgs((arg, id) => {
      if (arg.type === ArgType.Statement || arg.type === ArgType.Value) {
        if (arg.content) {
          contents.push(this.getArgBlockItem(arg))
        } else {
          contents.push(null)
        }
      } else if (typeof arg.content !== 'object') {
        contents.push(arg.content)
      } else {
        contents.push(null)
      }
    }, false);
    if (this.next.content) {
      contents.push(this.getArgBlockItem(this.next));
      (contents[contents.length - 1]! as Item).next = true
    }
    const item: Item = {
      block: this.name,
      args: contents,
    }
    if (this.isShadow) item.shadow = true
    return item
  }

  getArgBlockItem(arg: Arg): Item | null {
    if (arg.isBlockType() && arg.content) {
      return (arg.content as Block).getItem()
    }
    return null
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
    this.view?.setAttribute('transform', `translate(${x}, ${y})`)
  }

  getOpacity(): boolean {
    let block: Block = this
    while (block.isOpacity === OpacityType.Default && block.parent) {
      block = block.parent
    }
    return block.isOpacity === OpacityType.True
  }

  getGraph(): Graph | null {
    if (this.graph) return this.graph
    if (this.parent) return this.parent.getGraph()
    return null
  }
}

// 图形块类型
export enum BlockType {  // Next  Previous  Hat  Output
  Statement,        //   √       √
  Output,           //                         √
  Hat,              //   √              √
  Single,           //
  Start,            //   √
  Finish,           //           √
  HatSingle,        //                  √
}

// 图形块透明类型
export enum OpacityType {
  Default, // 根据父控件
  True,
  False,
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

  x?: number;
  y?: number;
}

