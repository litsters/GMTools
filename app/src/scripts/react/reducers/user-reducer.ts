import { updateState } from "./index";
import { UPDATE_USER, UPDATE_AUTH, UPDATE_CAMPAIGNS, UPDATE_CHARACTERS } from "../actions/user-actions";

var initialState: any = { 
    auth: null,
    campaigns: ['Campaign 1', 'Campaign 2'],
    characters: ['character 1', 'character 2', 'character 3']
};

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_USER:
            return state;
        case UPDATE_AUTH:
            return updateState(state, payload);
        case UPDATE_CAMPAIGNS:
            return updateState(state, payload);
        case UPDATE_CHARACTERS:
            return updateState(state, payload);
        default:
            return state;
    }
}