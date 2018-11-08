export { default as UserReducer } from "./user-reducer";
export { default as CodexReducer } from "./codex-reducer";


export const mergeObject = (state:any, propName:string, data:any) => {
    return {
        ...state,
        [propName]: {
            ...data
        }
    }
}

export const mergeArray = (state:any, propName:string, data:any) => {
    return {
        ...state,
        [propName]: [
            ...data
        ]
    }
}

export const updateState = (state:any, newState:any) => {
    Object.keys(newState).forEach(key => {
        let value = newState[key];

        if (Array.isArray(value)) {
            state = {
                ...state,
                [key]: [
                    ...value
                ]
            }
        }
    
        else if (typeof(value) === "object") {
            state = {
                ...state,
                [key]: {
                    ...value
                }
            }
        }

        else {
            state = {
                ...state,
                [key]: value
            }
        }
    })

    return state;
}
