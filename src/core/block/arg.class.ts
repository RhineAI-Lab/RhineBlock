export default class Arg {
  content: any;
  default: any;

  text: string = '';
  field: FieldType = FieldType.None;
  value: string | number | boolean = '';
  statement: string = '';

  constructor(
    public id: number,
    public type: ArgType,
  ) {
  }

  static fromJson(id: number, data: IArg): Arg {
    if (!data.type) {
      if (data.text) {
        data.type = ArgType.Text
      }else if (data.field) {
        data.type = ArgType.Field;
      }else if (data.value) {
        data.type = ArgType.Value;
      }else if (data.statement) {
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
        arg.field = data.field!;
        break;
      case ArgType.Value:
        arg.value = data.value!;
        break;
      case ArgType.Statement:
        arg.statement = data.statement!;
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


