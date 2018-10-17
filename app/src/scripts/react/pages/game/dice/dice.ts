/*
  Simulated Dice
*/

export function GenerateDice(defs: string) {
  defs = defs.replace(' ', '');

  let dice = [],
    types = defs.split(',');

  for (let i = 0; i < types.length; i++) {
    let data = ParseDefinition(types[i]);
    if (data === null) continue;

    for (let j = 0; j < data.num_dice; j++) {
      let d = new Dice(data.num_sides, data.operator, data.operand);
      dice.push(d);
    }
  }

  return dice;
}

interface DiceDefinition {
  num_dice: number,
  operator: string,
  num_sides: number,
  operand: number
};

function ParseDefinition(def: string) {
  const template = /[0-9]*d[0-9]*[+-/*][0-9]*/;
  if (!template.test(def)) return null;

  let result: DiceDefinition = {num_dice: 0, operator: "", num_sides: 0, operand: 0};

  const parts = def.split('d');
  result.num_dice = parseInt(parts[0], 10);
  result.operator = parts[1].replace(/[1-9]/g, '');
  if (result.operator) {
    const subparts = parts[1].split(result.operator);
    result.num_sides = parseInt(subparts[0], 10);
    result.operand = parseInt(subparts[1], 10);
  }
  else {
    result.num_sides = parseInt(parts[1], 10);
  }

  return result;
}

class Dice {

  numSides: number;
  operator: string;
  operand: number;

  constructor(numSides: number, operator: string = null, operand: number = null) {
    this.numSides = numSides;
    this.operator = operator;
    this.operand = operand;
  }
  
  applyModifier(value: number) {
    const { operator, operand } = this;
    if (operator && operand !== null) {
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
    
    result = this.applyModifier(result);

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
