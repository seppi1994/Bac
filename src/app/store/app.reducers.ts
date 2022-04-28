import {createReducer, on} from "@ngrx/store";
import {AppState} from "./app.state";
import {updateEdges, updateNodes} from "./app.actions";

export const initialState: AppState = {
  nodes:  [],
  edges: []
};

export const appReducer = createReducer(
  initialState,
  on(updateNodes, (state, action) => ({
    ...state,
    nodes: action.nodes
  })),
  on(updateEdges, (state, action) => ({
    ...state,
    edges: action.edges
  })));
