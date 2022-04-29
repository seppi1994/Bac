import {createReducer, on} from "@ngrx/store";
import {AppState} from "./app.state";
import {updateEdges, updateNodes, updateParsingTree} from "./app.actions";

export const initialState: AppState = {
  nodes:  [],
  edges: [],
  parsingTree: {
    nodes: []
  }
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
  })),
  on(updateParsingTree, (state, action) => ({
    ...state,
    parsingTree: action.parsingTree
  })));
