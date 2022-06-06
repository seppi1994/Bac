import {createReducer, on} from "@ngrx/store";
import {AppState} from "./app.state";
import {elementClicked, updateConstrains, updateEdges, updateNodes, updateParsingTree} from "./app.actions";

export const initialState: AppState = {
  nodes:  [],
  edges: [],
  parsingTree: {
    nodes: []
  },
  constrains: [],
  focusElement: 0
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
  on(updateConstrains, (state, action) => ({
    ...state,
    constrains: action.constrains
  })),
  on(updateParsingTree, (state, action) => ({
    ...state,
    parsingTree: action.parsingTree
  })),
  on(elementClicked, (state, action) => ({
    ...state,
    focusElement: action.id
  })));
