import { UPDATE_GENERATOR_DATA } from '../actions/generator-actions';

let initialState: any = {
  grammar: null,
  rollTables: null
};

export default function(state = initialState, { type, payload }: {type: any, payload: any}) {

  switch(type) {
    case UPDATE_GENERATOR_DATA:
      return {
        ...state,
        grammar: payload.grammar,
        rollTables: payload.rollTables
      };
    default:
      return state;
  }
}