import { UPDATE_CODEX } from "../actions/codex-actions";

var initialState: any = {
    codex: null
};

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    console.log("codex reducer");
    console.log(type, payload)
    switch(type) {
        case UPDATE_CODEX:
            console.log("updating codex")
            return payload.codex;
        default:
            return state;
    }
}