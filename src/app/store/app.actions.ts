import {createAction, props} from "@ngrx/store";
import {Node} from "../shared/model/node";
import {Edge} from "../shared/model/edge";
import {ParsingTree} from "../shared/model/parsing-tree";


export const updateNodes = createAction("Update Nodes", props<{ nodes: Node[] }>());
export const updateEdges = createAction("Update Edges" , props<{ edges: Edge[] }>());

export const updateParsingTree = createAction("Update ParsingTree", props<{ parsingTree: ParsingTree }>());
