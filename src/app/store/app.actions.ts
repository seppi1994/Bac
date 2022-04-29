import {createAction, props} from "@ngrx/store";
import {Node} from "../model/node";
import {Edge} from "../model/edge";
import {ParsingTree} from "../model/parsing-tree";


export const updateNodes = createAction("Update Nodes", props<{ nodes: Node[] }>());
export const updateEdges = createAction("Update Edges" , props<{ edges: Edge[] }>());

export const updateParsingTree = createAction("Update ParsingTree", props<{ parsingTree: ParsingTree }>());
