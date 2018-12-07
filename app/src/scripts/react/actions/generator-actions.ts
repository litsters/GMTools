export const UPDATE_GENERATOR_DATA = "generator:updateData";

interface GeneratorData {
  grammar: any,
  tables: any
}
export function updateGeneratorData(data: GeneratorData) {

  return {
    type: UPDATE_GENERATOR_DATA,
    payload: {
      grammar: data.grammar,
      rollTables: data.tables
    }
  }
}

export function apiGetGeneratorData() {
  return (dispatch: any) => {
    fetch("/plugin/dnd-5e", { method: "GET"})
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        dispatch(updateGeneratorData({grammar: data["generator-grammar"], tables: data["generator-tables"] }))
      });
  }
}