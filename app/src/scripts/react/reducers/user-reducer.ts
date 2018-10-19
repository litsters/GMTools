import { UPDATE_USER, UPDATE_AUTH } from "../actions/user-actions";

var initialState: any = { auth: null };

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_USER:
            return payload.user;
        case UPDATE_AUTH:
            return payload.auth;
        default:
            return state;
    }
}