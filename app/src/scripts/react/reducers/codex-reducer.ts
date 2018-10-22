import { UPDATE_CODEX } from "../actions/codex-actions";

var initialState: any = {
    codex: null
};

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_CODEX:
            return payload.codex;
        default:
            return state;
    }
}