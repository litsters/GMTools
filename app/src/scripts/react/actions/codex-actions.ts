export const UPDATE_CODEX = "codex:updateCodex";

export function updateCodex(codex: any) {
    return {
        type: UPDATE_CODEX,
        payload: {
            codex: codex
        }
    }
}

// note: theoretically apiGetCodex should cache response in the browser, making this unecessary
// export function loadCodexFromLocal() {
//     let json = localStorage.getItem("codex");
//     let codex = JSON.parse(json);
//     updateCodex(codex);
// }

// function saveCodexToLocal(codex:any) {
//     let json = JSON.stringify(codex);
//     localStorage.setItem("codex", json);
// }

export function apiGetCodex() {
    console.log("getting from api")
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