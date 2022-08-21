export default class Block {
  constructor(
    public name: string,
    public type: BlockType,
    public lines: Array<string>,
    public output: string | null,
    public color: string,
    public style: string,
  ) {

  }
}


export class IBlock {

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
