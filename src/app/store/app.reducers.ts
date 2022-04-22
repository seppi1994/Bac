import {createReducer, on} from "@ngrx/store";
import {AppState} from "./app.state";
import {updateNodes} from "./app.actions";

export const initialState: AppState = {
  nodes: []
};

export const appReducer = createReducer(
  initialState,
  on(updateNodes, (state, action) => ({
    ...state,
    nodes : [...action.nodes]
  })));
