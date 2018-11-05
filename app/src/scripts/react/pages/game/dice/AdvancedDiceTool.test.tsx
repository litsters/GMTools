import React from 'react';
import {shallow} from 'enzyme';
import AdvancedDiceTool from 'src/scripts/react/pages/game/dice/AdvancedDiceTool';

test("basic dice roll", () => {

  const diceRoller = shallow(<AdvancedDiceTool></AdvancedDiceTool>);


  diceRoller.find("input").simulate("change", {target: {value: '1d20'}});
  expect(diceRoller.find("div.result").text()).toBeLessThanOrEqual(20);
  expect(diceRoller.find("div.result").text()).toBeGreaterThanOrEqual(1);

});