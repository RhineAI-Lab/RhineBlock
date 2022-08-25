export default class Arg {
  content: any = null; // 当前内容值
  default: any; // 默认值

  text: string = ''; // 仅当文本模式启用，表示文本内容
  fieldType: FieldType = FieldType.None; // 仅当填充模式启用，表示填充类型
  valueType: string | number | boolean = ''; // 仅当输入图形块模式启用，表示输入图形块类型
  statementType: string = ''; // 仅当语句块输入模式启用，表示下方语句块类型

  onValueChange: (arg: Arg) => void = () => {
  }; // 当数据发生变化时

  view: SVGElement | null = null;
  x: number = 0;
  y: number = 0;
  w: number = 0;
  h: number = 0;

  constructor(
    public id: number,
    public type: ArgType,
  ) {
  }

  updateViewPosition(bias: number[] = [0, 0]): void {
    if (this.view) {
      this.view.setAttribute('transform', `translate(${this.x + bias[0]}, ${this.y + bias[1]})`);
    }
  }

  static fromJson(id: number, data: IArg): Arg {
    if (!data.type) {
      if (data.text !== undefined) {
        data.type = ArgType.Text
      } else if (data.field !== undefined) {
        data.type = ArgType.Field;
      } else if (data.value !== undefined) {
        data.type = ArgType.Value;
      } else if (data.statement !== undefined) {
        data.type = ArgType.Statement;
      } else {
        data.type = ArgType.Text
      }
    }
    let arg = new Arg(id, data.type);
    switch (data.type) {
      case ArgType.Text:
        arg.text = data.text!;
        break;
      case ArgType.Field:
        arg.fieldType = data.field!;
        break;
      case ArgType.Value:
        arg.valueType = data.value!;
        break;
      case ArgType.Statement:
        arg.statementType = data.statement!;
        break;
    }
    if (data.content) {
      arg.content = data.content;
    }
    if (data.default) {
      arg.default = data.default;
    }
    return arg
  }

  static fromLineStr(id: number, line: string): Arg {
    return new Arg(id, ArgType.Text)
  }

}

export interface IArg {
  type?: ArgType;
  content?: any;
  default?: any;

  text?: string;
  field?: FieldType;
  value?: string | number | boolean;
  statement?: string | null;
}

export enum ArgType {
  Text,
  Field,
  Value,
  Statement,
}

export enum FieldType {
  None = -1,
  Text,
  Number,
  Dropdown,
  Checkbox,
  Image,
  Color,
}


