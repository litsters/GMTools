export const UPDATE_USER = "user:updateUser";

export function updateUser(newUser) {
    return {
        type: UPDATE_USER,
        payload: {
            user: newUser
        }
    }
}

export function apiRequest() {
    return dispatch => {
        // perform api request
    }
}