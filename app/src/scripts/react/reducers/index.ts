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
