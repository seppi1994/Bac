import {Node} from "../model/node";
import {Edge} from "../model/edge";
import {ParsingTree} from "../model/parsing-tree";

export interface AppState{
  nodes: Node[];
  edges: Edge[];
  parsingTree: ParsingTree;
}
