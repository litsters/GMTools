import { UPDATE_CODEX, UPDATE_TABS } from "../actions/codex-actions";
import { mergeObject, mergeArray } from "./index";

var initialState: any = {
    codex: null,
    tabs: []
 };

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_CODEX:
            return mergeObject(state, "codex", payload.codex);/*{
                ...state,
                codex: {
                    ...payload.codex
                }
            }*/
        case UPDATE_TABS:
            return mergeArray(state, "tabs", payload.tabs);/*{
                ...state,
                tabs: payload.tabs
            };*/
        default:
            return state;
    }
}