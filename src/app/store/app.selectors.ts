import {AppState} from "./app.state";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export const selectAppState = createFeatureSelector<AppState>('app');

export const fromAppSelectedNodes = createSelector(selectAppState, (state: AppState) => state.nodes);
export const fromAppSelectedEdges = createSelector(selectAppState, (state: AppState) => state.edges);
export const fromAppSelectedConstrains = createSelector(selectAppState, (state: AppState) => state.constrains);


export const fromAppSelected = createSelector(selectAppState, (state: AppState) => state.parsingTree);

export const fromAppFocusElement = createSelector(selectAppState, (state: AppState) => state.focusElement);

