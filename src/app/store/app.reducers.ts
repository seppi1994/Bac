import {createReducer, on} from "@ngrx/store";
import {AppState} from "./app.state";
import {updateNodes} from "./app.actions";

export const initialState: AppState = {
  nodes: [
    {id: 0, reflexive: false, x: 500, y: 100},
    {id: 1, reflexive: true, x: 200, y: 350},
    {id: 2, reflexive: false, x: 300, y: 300},
    {id: 3, reflexive: false, x: 500, y: 300}
  ]
};

export const appReducer = createReducer(
  initialState,
  on(updateNodes, (state, action) => ({
    ...state,
    nodes : action.nodes
  })));
