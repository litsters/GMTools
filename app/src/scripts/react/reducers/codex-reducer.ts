import { UPDATE_CODEX, UPDATE_TABS } from "../actions/codex-actions";

var initialState: any = {
    codex: null,
    tabs: []
 };

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_CODEX:
            return {
                ...state,
                codex: {
                    ...payload.codex
                }
            }
        case UPDATE_TABS:
            return {
                ...state,
                tabs: payload.tabs
            }; 
        default:
            return state;
    }
}