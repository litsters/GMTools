export const UPDATE_USER = "user:updateUser";

export function updateUser(newUser: any) {
    return {
        type: UPDATE_USER,
        payload: {
            user: newUser
        }
    }
}

export function apiRequest() {
    return (dispatch: any) => {
        // perform api request
    }
}