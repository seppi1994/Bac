import {createAction, props} from "@ngrx/store";
import {NodeModel} from "../model/node.model";


export const updateNodes = createAction("Update Nodes", props<{ nodes: NodeModel[] }>());
