import {AppState} from "./app.state";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export const selectAppState = createFeatureSelector<AppState>('app');

export const fromAppSelectedNodes = createSelector(selectAppState, (state: AppState) => state.nodes);