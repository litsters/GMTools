export const UPDATE_CODEX = "codex:updateCodex";

export function updateCodex(codex: any) {
    return {
        type: UPDATE_CODEX,
        payload: {
            codex
        }
    }
}

export function apiGetCodex() {
    console.log("retrieving codex...")
    return (dispatch: any) => {
        fetch("/plugins/dnd-5e", { method: "GET"})
        .then((res) => {
            return res.json();
        })
        .then(data => {
            console.log(data)
            return { type: UPDATE_CODEX, payload: data };
        });
    }
}