import { UPDATE_USER } from "../actions/user-actions";

var initialState: any[] = [];

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {
    switch(type) {
        case UPDATE_USER:
            return payload.user;
        default:
            return state;
    }
}