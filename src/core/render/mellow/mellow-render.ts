import BaseRender from "../base/base-render";
import {MellowShapeProvider} from "./mellow-shape-provider";

export default class MellowRender extends BaseRender{

  static provider = new MellowShapeProvider();

  
}
