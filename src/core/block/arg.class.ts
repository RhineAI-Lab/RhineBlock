export default class Arg {
  content: any;
  default: any;

  text: string = '';
  fieldType: FieldType = FieldType.None;
  valueType: string | number | boolean = '';
  statementType: string = '';

  value: any = null;
  onValueChange = () => {};

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

  static fromJson(id: number, data: IArg): Arg {
    if (!data.type) {
      if (data.text !== undefined) {
        data.type = ArgType.Text
      }else if (data.field !== undefined) {
        data.type = ArgType.Field;
      }else if (data.value !== undefined) {
        data.type = ArgType.Value;
      }else if (data.statement !== undefined) {
        data.type = ArgType.Statement;
      }else {
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
    if(data.content){
      arg.content = data.content;
    }
    if(data.default){
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


