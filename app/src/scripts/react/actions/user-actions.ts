import Auth from "../auth/Auth";

export const UPDATE_USER = "user:updateUser";
export const UPDATE_AUTH = "user:updateAuth";
export const UPDATE_CHARACTERS = "user:updateCharacters";

export function updateUser(newUser: any) {
    return {
        type: UPDATE_USER,
        payload: {
            user: newUser
        }
    }
}

export function updateAuth(auth:Auth) {
    return {
        type: UPDATE_AUTH,
        payload: {
            auth: auth
        }
    }
}

export function updateCharacters(characters:any) {
    return {
        type: UPDATE_CHARACTERS,
        payload: {
            characters: characters
        }
    }
}