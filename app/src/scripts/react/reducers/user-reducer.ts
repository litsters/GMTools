import { UPDATE_USER, UPDATE_AUTH, UPDATE_CHARACTERS } from "../actions/user-actions";
import { mergeObject } from "./index";

var initialState: any = { 
    auth: null,
    characters: null,
    user: null
};

let savedAuth = localStorage.getItem("auth") || null;
initialState.auth = savedAuth ? JSON.parse(savedAuth) : null;

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_USER:
            return mergeObject(state, "user", payload.user);
        case UPDATE_AUTH:
            return mergeObject(state, "auth", payload.auth);
        case UPDATE_CHARACTERS:
            return mergeObject(state, "characters", payload.characters);
        default:
            return state;
    }
}

