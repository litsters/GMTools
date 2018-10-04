/*
  Simulated Dice
*/

export function GenerateDice(defs) {
  defs = defs.replace(' ', '');

  let dice = [],
    types = defs.split(',');

  for (var i = 0; i < types.length; i++) {
    let data = ParseDefinition(types[i]);
    if (data === null) continue;

    for (var j = 0; j < data.num_dice; j++) {
      let d = new Dice(data.num_sides, data.operator, data.operand);
      dice.push(d);
    }
  }

  return dice;
}

function ParseDefinition(def) {
  const template = /[0-9]*d[0-9]*[+-/*][0-9]*/;
  if (!template.test(def)) return null;

  let result = {};
  const parts = def.split('d');
  result.num_dice = parts[0];
  result.operator = parts[1].replace(/[1-9]/g, '');
  if (result.operator) {
    const subparts = parts[1].split(result.operator);
    result.num_sides = subparts[0];
    result.operand = subparts[1];
  }
  else {
    result.num_sides = parts[1];
  }

  return result;
}

class Dice {
  constructor(numSides, operator = null, operand = null) {
    this.numSides = numSides;
    this.operator = operator;
    this.operand = operand;
  }
  
  applyModifier(value) {
    if (this.operator && this.operand !== null) {
      switch(operator) {
        case '+': return value + operand;
        case '-': return value - operand;
        case '/': return value / operand;
        case '*': return value * operand;
        default: return value;
      }
    }
    return value;
  }

  roll() {
    let result =  Math.floor(Math.random() * this.numSides) + 1;  
    
    result = this.applyModifier(value);

    return result;
  }
}

// This is temporary code to test the Dice generator and class
  // should be migrated to testing framework code
export const Test = () => {
  const definition = "3d2+2, 6d2-1, 4d8";

  let dice = GenerateDice(definition);
  if (dice.length !== 13) throw new Error();

  let dice1_roll = dice[0].roll();
  if (dice1_roll > 5 || dice1_roll < 3) throw new Error();
}

export default Dice;
