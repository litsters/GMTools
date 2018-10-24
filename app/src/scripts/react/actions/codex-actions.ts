export const UPDATE_CODEX = "codex:updateCodex";
export const UPDATE_TABS = "codex:updateTabs";

export function updateCodex(codex: any) {
    return {
        type: UPDATE_CODEX,
        payload: {
            codex: codex
        }
    }
}

export function updateTabs(tabs: any) {
    return {
        type: UPDATE_TABS,
        payload: {
            tabs: tabs
        }
    }
}

export function apiGetCodex() {
    console.log("getting codex from api")
    return (dispatch: any) => {
        fetch("/plugin/dnd-5e", { method: "GET"})
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => dispatch(updateCodex(data)));
    }
}