import {Node} from "../shared/model/node";
import {Edge} from "../shared/model/edge";
import {ParsingTree} from "../shared/model/parsing-tree";

export interface AppState{
  nodes: Node[];
  edges: Edge[];
  parsingTree: ParsingTree;
}
