// import React from 'react';
// import CharactersSection from './CharactersSection';
// import ReactDOM from "react-dom";

// test('characters section renders', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<CharactersSection characters={} updateCharacters={() => {}} />, div);
//     ReactDOM.unmountComponentAtNode(div);
// });

// test('adds character', () => {
//     // Setup to add the character
//     const expectedState = {
//         characters: ['Character 1', 'Character 2', 'Character 3'],
//     };
//     const mockSetState = jest.fn();

//     // Create the object, mock setState, and run the test
//     const section = new CharactersSection();
//     section.setState = mockSetState;
//     section.addCharacter();

//     // Validate
//     expect(mockSetState.mock.calls.length).toBe(1);
//     expect(mockSetState.mock.calls[0][0]).toEqual(expectedState);
// });
