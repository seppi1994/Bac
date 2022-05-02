import {Node} from "../shared/model/node";
import {Edge} from "../shared/model/edge";
import {ParsingTree} from "../pages/parser/model/parsing-tree";
import {Constrain} from "../shared/model/constrain";

export interface AppState{
  nodes: Node[];
  edges: Edge[];
  parsingTree: ParsingTree;
  constrains: Constrain[]
}
