import React from 'react';
import CharactersSection from './CharactersSection';
import ReactDOM from "react-dom";

test('characters section renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CharactersSection />, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('adds character', () => {
    // Setup to add the character
    const expectedState = {
        characters: [{
            name: 'Jest',
        }],
    };
    const mockSetState = jest.fn();

    // Create the object, mock setState, and run the test
    const section = new CharactersSection({});
    section.setState = mockSetState;
    section.dataPersisted({
        namespace: 'character',
        key: 'new_character',
        data: {
            name: 'Jest',
        },
    });

    // Validate
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState.mock.calls[0][0]).toEqual(expectedState);
});
