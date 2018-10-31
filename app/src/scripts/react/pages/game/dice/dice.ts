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

    let group = [];
    for (var j = 0; j < data.num_dice; j++) {
      let d = new Dice(data.num_sides, data.operator, data.operand);
      group.push(d);
    }
    dice.push(group);
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
  const template = /[1-9]*d[0-9]+([+-/*][0-9])?$/;
  if (!template.test(def)) return null;

  let result: DiceDefinition = {num_dice: 0, operator: "", num_sides: 0, operand: 0};

  const parts = def.split('d');
  result.num_dice = parseInt(parts[0], 10) || 1;
  result.operator = parts[1].replace(/[0-9]/g, '');
  if (result.operator) {
    const subparts = parts[1].split(result.operator);
    result.num_sides = parseInt(subparts[0], 10);
    result.operand = parseInt(subparts[1], 10);
  }
  else {
    result.num_sides = parseInt(parts[1], 10);
  }
  console.log(result)
  return result;
}

export function ValidateDefinition(def: string) {
  if (def.length === 0) return null;

  const template = /^([1-9]*d[0-9]+([+-/*][0-9])?)(,([1-9]*d[0-9]+([+-/*][0-9])?))*$/;
  const test = template.test(def);

  if (!test) return false;
  else return true;
}

export function RollDiceGroups(diceGroups: any) {
  let result = {
    value: 0,
    details: ""
  };

  for (var i = 0; i < diceGroups.length; i++) {
    let group = diceGroups[i];
    
    if (group.length === 1) {
      let rollValue = group[0].roll();
      result.value += rollValue;
      result.details += rollValue;
    }
    else {
      result.details += "{";
      for (var j = 0; j < group.length; j++) {
        let rollValue = group[j].roll();
        result.value += rollValue;
        result.details += rollValue + (j === group.length - 1 ? "" : ",");
      }
      result.details += "}";
    }
    result.details += i === diceGroups.length - 1 ? "" : ",";
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


export default Dice;
