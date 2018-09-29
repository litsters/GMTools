import { UPDATE_USER } from "../actions/user-actions";

var initialState = []

export default function(state = initialState, { type, payload }) {
    switch(type) {
        case UPDATE_USER:
            return payload.user;
        default:
            return state;
    }
}