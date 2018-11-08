import { mergeObject, mergeArray } from "./index";
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
            return mergeObject(state, "auth", payload.auth);
        case UPDATE_CAMPAIGNS:
            return mergeArray(state, "campaigns", payload.campaigns);
        case UPDATE_CHARACTERS:
            return mergeArray(state, "characters", payload.characters);
        default:
            return state;
    }
}