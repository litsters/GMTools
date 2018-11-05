import React from 'react';
import CharacterPreview from './CharacterPreview';
import ReactDOM from "react-dom";

test('character preview renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CharacterPreview name="Jest" />, div);
    ReactDOM.unmountComponentAtNode(div);
});
