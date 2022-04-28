import {createAction, props} from "@ngrx/store";
import {Node} from "../model/node";
import {Edge} from "../model/edge";


export const updateNodes = createAction("Update Nodes", props<{ nodes: Node[] }>());
export const updateEdges = createAction("Update Edges" , props<{ edges: Edge[] }>());
