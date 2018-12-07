import React, { Component } from "react";
import IPage from "../../../interfaces/IPage";
import { connect } from 'react-redux';
import { apiGetGeneratorData } from '../../../actions/generator-actions';
import { GeneratorReducer } from "../../../reducers";


//----------------------------------------------------------------------------------------------------------------------
// Name generator
//----------------------------------------------------------------------------------------------------------------------

interface IRoot
{
  display: string,
  startSymbol: string
}

interface IRule
{
  text: string,
  weight: number
}

type Rule = IRule | string;

interface Grammar
{
  roots: {
    [key: string]: IRoot
  },
  rules: {
    [key: string]: Rule[]
  }
}

class CFGExpander
{
  grammar: Grammar;

  constructor(grammar: Grammar)
  {
    this.grammar = grammar;

    for (let key of Object.keys(this.grammar.rules))
    {
      for (let rule of this.grammar.rules[key])
      {
        let textExp;

        textExp = typeof rule === "string" ? rule : rule.text;

        let regex = /(\$(\w+)|\${(\w+)})/g;
        let match = null;

        while ((match = regex.exec(textExp)) !== null)
        {
          let ruleRef = match[2] || match[3];

          if (this.grammar.rules[ruleRef] === undefined)
            throw new Error(`Grammar invalid: No rule matching ${ruleRef}`);
        }
      }

    }
  }

  expand(rule: string): ExpandedGrammar
  {
    return new Expansion(this.grammar, rule).expand()
  }
}

class Expansion
{
  alternatives: Rule[];
  totalWeight = 0;
  grammar: Grammar;
  text: string;

  constructor(grammar: Grammar, ruleStr: string)
  {
    if (grammar.rules[ruleStr] === undefined)
      throw new Error(`Cannot expand ${ruleStr}: no such rule`);

    this.grammar = grammar;

    this.alternatives = grammar.rules[ruleStr];

    for (let alternative of this.alternatives)
    {
      this.totalWeight += typeof alternative === "string" ? 1 : alternative.weight;
    }
  }

  expand(): ExpandedGrammar
  {
    let index = Math.floor( Math.random() * (this.totalWeight + 1) );
    let choice: Rule;
    let runningTotal = 0;

    for (let alternative of this.alternatives)
    {
      runningTotal += typeof alternative === "string" ? 1 : alternative.weight;

      if (runningTotal >= index)
      {
        choice = alternative;
        break;
      }
    }

    this.text = typeof choice === "string" ? choice : choice.text;

    let regex = /(\$(\w+)|\${(\w+)})/g;
    let match;

    while (this.text.includes("$"))
    {
      while ((match = regex.exec(this.text)) !== null)
      {

        let ruleTxt: string = match[1];
        let ruleRef = match[2] || match[3];

        if (ruleTxt.length > 0 && ruleRef.length > 0)
        {
          this.text = this.text.replace(ruleTxt, new Expansion(this.grammar, ruleRef).expand().text);
        }
      }
    }

    this.text = this.text.replace(/&cap{(.*)}/g, (match, group1) => (group1[0].toLocaleUpperCase() + group1.slice(1)));

    return this;
  }

}

//----------------------------------------------------------------------------------------------------------------------
// Roll table handler
//----------------------------------------------------------------------------------------------------------------------

type RollTableDict = {[key: string]: RollTableDef}
type RollReference = (string | RollTableRef);
type RolledNumber = string;                       // XdY + Z
type RollValue = (RollValueDef | string | number)

// In a list of rolls or subrolls to make, refers to the table to roll on
interface RollTableRef {
  table: string,
  qty?: number | RolledNumber
}

// eq: match value exactly; lt: less than numeric value, gt: greater than numeric value, rolls: make these rolls on match
interface ConditionClause {
  eq?: any,
  lt?: number,
  gt?: number,
  rolls: RollReference[]
}

// match: check clauses for match; matchNumber: treat value of dependency as a qty for these rolls
interface Condition {
  match?: ConditionClause
  matchNumber?: {rolls: RollReference[]}
}

// When dependency has value, add amt to the modified roll
interface Modifier {
  value: any,
  amt: number
}

// alter the roll according to the dependency's value
interface ModifiedRoll {
  id: string,
  display: string,
  dependsOn: string,
  table: string,
  modifiers: Modifier[]
}

interface Option {
  display: string,
  rolls: RollReference[]
}

// Rolls that require some kind of user selection
interface OptionalRoll {
  id: string,
  display: string,
  options: Option[]
}

interface ConditionalRoll {
  id: string,
  display: string,
  dependsOn: string,
  conditions: Condition[]
}

interface RollValueDef {
  value: string | number,
  weight?: number,
  rolls?: RollReference[]
  condRolls?: ConditionalRoll[]
  modifiedRolls?: ModifiedRoll[]
}

interface RollTableDef {
  clamp?: {min: number, max: number},
  display: string
  values: RollValue[]
}

// Represents a logical grouping of table rolls, like an NPC, plotline, or character backstory
interface RollerDef {
  id: string,
  display: string,
  rolls?: RollReference[],
  condRolls?: ConditionalRoll[],
  modifiedRolls?: ModifiedRoll[],
  optionalRolls?: OptionalRoll[],
  sections?: RollerDef[]
}

interface RollTableDefinition {
  tables: RollTableDict
  content: RollerDef[]
}

interface SingleRollResult {
  display: string
  result: any,
  roll: number
  children?: {[key: string]: SingleRollResult | SingleRollResult[]}
}

class Roller
{
  id: string;
  results: {[key: string]: any} = {};
  definition: RollerDef;
  tables: RollTableDict;
  children: Roller[] = [];

  constructor(rollerDef: RollerDef, tables: RollTableDict) {
    this.definition = rollerDef;
    this.tables = tables;

    this.id = this.definition.id;

    if (this.definition.sections)
      for (let rollerDef of this.definition.sections)
        this.children.push( new Roller( rollerDef, this.tables ))
  }

  roll()
  {
    if (this.definition.rolls)
      this.handleRolls(this.definition.rolls);

    if (this.definition.condRolls)
      for (let roll of this.definition.condRolls)
      {
        let rollResult = (this.results[roll.dependsOn] as SingleRollResult);

        for (let cond of roll.conditions)
        {
          if (cond.match)
          {
            if (  cond.match.eq && rollResult.result == cond.match.eq
              ||  cond.match.lt && rollResult.roll   <  cond.match.lt
              ||  cond.match.gt && rollResult.roll   >  cond.match.gt)
            {
              this.handleRolls(cond.match.rolls, roll.id, roll.display);
              break;
            }

          }
          else if (cond.matchNumber)
          {
            let matchNum = typeof rollResult.result === "number" ? rollResult.result : new DieRoll(rollResult.result).roll();
            this.handleRolls(cond.matchNumber.rolls, roll.id, roll.display, matchNum);
          }
        }
      }

    if (this.definition.modifiedRolls)
      for (let roll of this.definition.modifiedRolls)
      {
        let rollResult = (this.results[roll.dependsOn] as SingleRollResult);
        let modAmt = 0;

        for (let mod of roll.modifiers)
        {
          if (rollResult === mod.value)
            modAmt = mod.amt
        }

        this.results[roll.table] = this.doOneRoll(roll.table, modAmt);
      }

    if (this.definition.optionalRolls)
    {
      this.results["_optionals"] = {};
      for (let roll of this.definition.optionalRolls)
        this.results["_optionals"][roll.id] = {display: roll.display, options: roll.options};
    }

    for (let child of this.children)
    {
      this.results[child.id] = {display: child.definition.display, children: child.roll()};
    }

    return this.results;
  }

  rollOptional(id: string, option: string)
  {
    let hit = false;

    if (this.definition.optionalRolls)
      for (let roll of this.definition.optionalRolls)
        if (roll.id === id)
        {
          hit = true;

          for (let opt of roll.options)
            if (option === opt.display)
              this.handleRolls(opt.rolls);
            else
            {
              for (let otherRoll of opt.rolls)
              {
                let key = typeof otherRoll === "string" ? otherRoll : otherRoll.table;
                if (this.results[key])
                  delete this.results[key];
              }
            }
        }


    if (hit === false)
      for (let child of this.children)
        child.rollOptional(id, option);

    return this.results;
  }

  private handleRolls(rollRefs: RollReference[], id?: string, display?: string, matchNum?: number )
  {
    if (matchNum === undefined)
    {
      for (let rollRef of rollRefs)
      {
        let rollId = id !== undefined ? id : typeof rollRef === "string" ? rollRef : rollRef.table;
        let result = this.handleRoll(rollRef);

        this.results[rollId] = Array.isArray(result) ? {display, results: result} : this.handleRoll(rollRef);
      }
    }
    else if (matchNum > 0)
    {
      if (!id)
        throw new Error("Can't match number without a set id!");

      this.results[id] = {display, results: []};

      for (let i = 0; i < matchNum; i++)
      {
        this.results[id].results[i] = {};
        for (let roll of rollRefs)
        {
          let key = typeof roll === "string" ? roll : roll.table;
          this.results[id].results[i][key] = this.handleRoll(roll);
        }
      }
    }
  }

  private handleRoll(rollRef: RollReference)
  {
    let results: any;

    if (typeof rollRef !== 'string')
    {
      let qty = typeof rollRef.qty === 'number' ? rollRef.qty : new DieRoll(rollRef.qty).roll();

      results = [];
      for (let i = 0; i < qty; i++)
        results.push(this.doOneRoll(rollRef.table));
    }
    else
    {
      results = this.doOneRoll(rollRef);
    }

    return results;
  }

  private doOneRoll(rollTable: string, modAmt = 0): SingleRollResult
  {
    if (this.tables[rollTable] === undefined)
      throw new Error(`No table for ${rollTable}!`);

    let rollItems: RollValue[];
    let table = this.tables[rollTable];
    let clampMin = -1;
    let clampMax = -1;

    rollItems = table.values;

    let totalWeight = 0;
    for (let rollItem of rollItems)
    {
      if (typeof rollItem === "string" || typeof rollItem === "number")
        totalWeight += 1;
      else
        totalWeight += rollItem.weight;
    }

    if (clampMax === -1 && clampMin === -1)
    {
      clampMin = 0;
      clampMax = totalWeight
    }

    let roll = Math.round((Math.random() * (clampMax - clampMin))) + clampMin;

    roll += modAmt;
    roll = Math.max(0, roll);

    totalWeight = 0;
    for (let rollItem of rollItems)
    {
      if (typeof rollItem === "string" || typeof rollItem === "number")
        totalWeight += 1;
      else
        totalWeight += rollItem.weight;

      if (totalWeight >= roll)
      {
        if (typeof rollItem === "string" || typeof rollItem === "number")
          return {result: rollItem, roll, display: table.display};
        else
        {
          let children: {[key: string]: any};

          if (rollItem.rolls)
          {
            children = {};

            for (let subRoll of rollItem.rolls)
            {
              if (typeof subRoll === "string")
                children[subRoll] = this.doOneRoll(subRoll);
              else
              {
                children[subRoll.table] = [];
                let qty = typeof subRoll.qty === "number"? subRoll.qty : new DieRoll(subRoll.qty).roll();

                for (let i = 0; i < qty; i++)
                  children.push( this.doOneRoll(subRoll.table) );
              }
            }
          }

          return {result: rollItem.value, roll, children, display: table.display};
        }
      }
    }

    throw new Error(`Unable to generate a valid roll! Make sure table ${rollTable} is defined properly.`);
  }
}

interface ExpandedGrammar
{
  text: string
}

class DieRoll {
  numDice: number;
  dieType: number;
  modifier: number;

  constructor(dieStr: string)
  {
    const regex = /(\d+)d(\d+)([+-]\d+)?/;

    let match = regex.exec(dieStr);

    this.numDice = parseInt(match[1], 10);
    this.dieType = parseInt(match[2], 10);
    this.modifier = match[3] ? parseInt(match[3], 10) : 0;
  }

  roll(): number
  {
    let total = 0;

    for (let i = 0; i < this.numDice; i++)
      total += Math.floor(Math.random() * this.dieType) + 1;

    total += this.modifier;
    return total;
  }
}

interface GeneratorPageProps {
  apiGetData: any
  generator: {
    grammar: Grammar
    rollTables: RollTableDefinition
  }
}

export interface GeneratorPageState {
  isLoading: boolean
  generatedText: string
  rollResults: {[key: string]: any}
}

class GeneratorPage extends Component<IPage & GeneratorPageProps, GeneratorPageState> {

    generator: CFGExpander = null;
    rollers: Roller[] = null;

    constructor(props: IPage & GeneratorPageProps) {
      super(props);

      this.state = {
        isLoading: true,
        generatedText: "",
        rollResults: {}
      }
    }

    componentDidMount() {
      if (!this.props.generator.grammar) {
        this.props.apiGetData();
      }
    }

    render() {

      if (!this.props.generator.grammar)
      {
        return <div>Loading...</div>;
      }

      if (this.generator == null)
      {
        this.generator = new CFGExpander(this.props.generator.grammar)
      }

      if (this.rollers == null)
      {
        this.rollers = [];
        for (let roller of this.props.generator.rollTables.content)
        {
          this.rollers.push( new Roller(roller, this.props.generator.rollTables.tables) );
        }
      }

      let roots: any = [];

      for (let rule of Object.values(this.props.generator.grammar.roots))
      {
        roots.push(<div key={rule.display}><button onClick={() => this.generate(rule.startSymbol)}>{rule.display}</button></div>);
      }

      let rollerHtml = [];

      for (let roller of this.rollers)
      {
        rollerHtml.push(<div key={roller.id}><button onClick={() => this.saveRoll({id: roller.id, results: roller.roll()}) }>{roller.definition.display}</button></div>);
        if (this.state.rollResults[roller.id] !== undefined)
        {
          let resultHtml = this.renderRollObj(roller, this.state.rollResults[roller.id], 1, "");
          rollerHtml.push(<div key={roller.id + "-result"}>{resultHtml}</div>);
        }
      }

      return (
          <div className="generator-page padding-15">
            <h1>Generator</h1>
            <div className="content">
              <div id="roots">{roots}</div>
              <div id="genText">{this.state.generatedText}</div>
              <h1>Roll tables</h1>
              <div id="rollTables">{rollerHtml}</div>
            </div>
          </div>
      );
    }

    generate(startSymbol: string)
    {
      let expanded = this.generator.expand(startSymbol);
      let state = this.state;

      this.setState({
          ...state,
          generatedText: expanded.text
      });
    }

    saveRoll({id, results}: {id: string, results: any})
    {
      let rollResults = this.state.rollResults;
      rollResults[id] = results;

      this.setState({
        ...this.state,
        rollResults
      });
    }

    private renderRollObj(roller: Roller, rollObj: any, level: number, key: string): any
    {
      if (rollObj.result !== undefined)
      {
        let subHtml: any = "";
        if (rollObj.children)
          subHtml = Object.values(rollObj.children).map( (val: any) => <p key={val.display + val.result}><strong>{val.display}</strong> {val.result}</p>);

        return <div key={rollObj.result + Math.random()}>{rollObj.result}{subHtml}</div>;
      }


      if (rollObj.results)
        return <ul>{rollObj.results.map( (item: any, idx: number) => <li><p><strong>{`${rollObj.display} ${idx + 1}`}</strong></p>{this.renderRollObj(roller, item, level + 1, key)}</li>)}</ul>;



      let children = [];
      const Heading = "h" + (1 + level);
      for (let key of Object.keys(rollObj))
      {
        if (key === "_optionals")
          continue;

        // headings have children tags
        let next = rollObj[key].result !== undefined || rollObj[key].results !== undefined ? rollObj[key] : rollObj[key].children;

        children.push( <div key={key}><Heading>{rollObj[key].display}</Heading>{ this.renderRollObj(roller, next, level + 1, key)}</div> );
      }

      if (rollObj._optionals)
      {
        children.push( Object.keys(rollObj._optionals).map( (id: string) => {
          return (
            <div>
              <select key={"select" + id} id={id}>{ rollObj._optionals[id].options.map( (opt: {display: string}) => <option key={opt.display}>{opt.display}</option>) }</select>
              <button onClick={ () => {
                let select = document.getElementById(id) as HTMLSelectElement;
                this.saveRoll({id: roller.id, results: roller.rollOptional(id, select.options[select.selectedIndex].value)});
              }}>
                Roll
              </button>
            </div>)
        }) );
      }

      return children;
    }

}

const mapDispatchToProps = (dispatch:any) => ({
  apiGetData: () => dispatch(apiGetGeneratorData()),
});

export default connect(GeneratorReducer, mapDispatchToProps)(GeneratorPage);