import { UPDATE_CODEX, UPDATE_TABS } from "../actions/codex-actions";
import codexReducer from './codex-reducer';

test('has an initial state', () => {
    const expectedState = {
        // @ts-ignore
        codex: null,
        // @ts-ignore
        tabs: [],
    };
    let state = codexReducer(undefined, { type: 'initialize', payload: undefined });
    expect(state).toEqual(expectedState);
});

test('updates codex', () => {
    const expectedState = {
        codex: {
            value: 'Jester'
        },
        // @ts-ignore
        tabs: [],
    };
    const action = {
        type: UPDATE_CODEX,
        payload: {
            codex: expectedState.codex,
        }
    };
    let state = codexReducer(undefined, action);
    expect(state).toEqual(expectedState);
});

test('updates tabs', () => {
    const expectedState = {
        // @ts-ignore
        codex: null,
        tabs: ['Redux'],
    };
    const action = {
        type: UPDATE_TABS,
        payload: {
            tabs: expectedState.tabs,
        }
    };
    let state = codexReducer(undefined, action);
    expect(state).toEqual(expectedState);
});
