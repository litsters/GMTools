import React, { Component } from "react";
import IPage from "../../../interfaces/IPage";

interface IRule
{
  text: string,
  weight: number
}

type Rule = IRule | string;

interface Grammar
{
  [key: string]: Rule[]
}

class CFGGenerator
{
  grammar: Grammar;

  constructor(grammar: Grammar)
  {
    this.grammar = grammar;

    for (let key of Object.keys(this.grammar))
    {
      for (let rule of this.grammar[key])
      {
        let textExp = typeof rule === "string" ? rule : rule.text;

        let regex = /(\$(\w+)|\$\{(\w+)\})/g;
        let match = null;

        while ((match = regex.exec(textExp)) !== null)
        {
          let ruleRef = match[2] || match[3];

          if (this.grammar[ruleRef] === undefined)
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
    if (grammar[ruleStr] === undefined)
      throw new Error(`Cannot expand ${ruleStr}: no such rule`);

    this.grammar = grammar;

    this.alternatives = grammar[ruleStr];

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

    let regex = /(\$(\w+)|\$\{(\w+)\})/g;
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

interface ExpandedGrammar
{
  text: string
}

const humanNames =
{
  root: ["$ethnicity"],

  ethnicity: ["$english", /*"$german"*/],
  english: ["$engFirst", "$engFirst $engLast", "$engFirst $engNick $engLast"],
  engFirst: [{text: "$engPresetFirst", weight: 1}, {text: "$engGenFirst", weight: 2}],
  engTitle: ["Lord", "Baron", "Count", "Sir", "Earl"],
  engNick: ["\"$engNickQuote\"", "the $engNickTheX"],
  engNickQuote: ["Anvil", "Dragon", "Hook", "Snake Eye", "Strider", "Salty", "Lucky", "Lefty", "Southpaw",
                "Sword", "Grim", "Tiny", "Pudge", "Longshanks", "Magic", "Roach", "Weevil", "Oak", "Stalker"],
  engNickTheX: ["Butcher", "Knife", "Grim", "Magnificent", "Cruel", "Red", "Black", "Grey", "Fox", "Bluejay", "Raven", "Reaver",
                "Reaper", "Kind", "Merciful", "Poet", "Bard", "Mad", "Tiny", "Grand", "Arcane", "${creature}slayer", "${creature}keeper"],
  creature: ["Goblin", "Orc", "Dragon", "Dwarf", "Elf", "Wraith", "Vampire", "Wolf", "Flumph", "Demon", "Devil", "Fiend", "Angel"],

  engPresetFirst: [
    {text: "$engPresetFirstCommon", weight: 5},
    {text: "$engPresetFirstMid", weight: 5},
    {text: "$engPresetFirstPosh", weight: 5},
    {text: "$engTitle $engPresetFirstMid", weight: 2},
    {text: "$engTitle $engPresetFirstPosh", weight: 3}
  ],
  engPresetFirstCommon: ["Alf", "Bill", "Bert", "Bob", "Charlie", "Ed", "Fred", "George", "Harry", "Jack", "Kay",
                   "Moe", "Norm", "Owen", "Pete", "Sammy", "Tom", "Tim", "Willie", "Nick"],
  engPresetFirstMid: ["John", "Thomas", "James", "Alfred", "Wallace", "Henry", "Calvin", "Bernard", "Nicholas", "Charles",
                      "Frederick", "Gilbert", "Albert", "Egbert", "Gunter", "Martin", "Marcus", "Lionel", "Leonard"],
  engPresetFirstPosh: ["Percival","Ignatius", "Reginald", "Bernard", "Balthazar", "Melchior", "Aldrich", "Uthar", "Aldus", "Alphonsus",
                       "Bertram", "Conrad", "Aldwin", "Archibald", "Cuthbert", "Godwin", "Osbert", "Erasmus", "Algernon", "Aloysius"],

  engGenFirst: ["&cap{$syllable$syllable}", "$engTitle &cap{$syllable$syllable}"],
  syllable: [
    "der", "ran", "son", "rick", "bald", "nob", "bal", "can", "pet", "or", "dun", "cob", "dan", "dro", "go", "bit",
    "mad", "sen", "mac", "lan", "ah", "hen", "fen", "then", "dav", "ben", "bol", "seb", "ni", "al", "aul", "wes", "ses",
    "con", "rad", "bof", "dem", "dim", "it", "mack", "cam", "ced", "set", "ner", "bert", "ford", "ash",
    "ley", "ton", "jon", "wal", "kil", "cer", "cel", "nor", "hro", "gen", "gan", "jor", "cuth",  "$syllable$syllable"
  ],

  engLast: ["$engPresetLast", "$engGenLast"],
  engPresetLast: ["Archer", "Fletcher", "Cooper", "Baker", "Wainwright", "Brown", "Jones", "Smith", "Clark", "Knight", "Tailor",
                   "Henderson", "Albertson", "Steele", "Cartwright", "Wright", "Farrier", "Magus", "Clapham", "Reeve", "Jenkins",
                   "Spaulding", "Skelton", "Barlow", "Hunter"],

  engGenLast: ["$engLastCompound"],
  engLastCompound: ["$firstCompound$secondCompound"],
  firstCompound: ["Strong", "Red", "Long", "Bone", "Lead", "Good", "Gold", "Green", "Silver", "Black", "One", "Iron", "Stone",
                  "Steel", "Deep", "Goblin", "Tree", "Foe", "Rock", "Fae", "Dwarf", "Goblin", "Elf", "Drake", "Dragon", "Orc",
                   "Night", "Wight", "Fiend", "Snake", "Worm", "Wyrm", "Half", "Bog", "Marsh", "Dune", "Shadow", "Bright", "Wind",
                   "Earth", "Sky", "Fire", "Flame", "Water", "Wave", "Mud", "Soot", "Smoke", "Fell", "Silk", "Potato", "Shade", "Hob",
                   "Troll", "Wolf", "Grim", "Dune", "Hill", "Grey", "Crag"],
  secondCompound: ["fellow", "friend", "shanks", "butcher", "hunter", "man", "bane", "ripper", "tongue", "arm", "reach", "tooth", "eye",
              "foot", "hand", "grave", "seeker", "finder", "killer", "ender", "crusher", "born", "walker",
              "strider", "watcher", "keeper", "shod", "shot", "eater", "nose", "smith", "tamer", "rider", "fodder"],

};

// const humanNames =
// {
//     root: [/*"#preset#",*/ "$generated"],
//
//     preset: ["$ethnicity"],
//     ethnicity: ["$english"],
//
//     english: ["$engFirst $engLast", "$engFirst \"$nickName\" $engLast"],
//     engFirst: ["Alfred", "Bertie", "Bernard", "Charles", "Gilbert", "Guy", "Henry", "John", "Jack", "James", "Miles", "Percival"],
//     engLast: ["Jones", "Smith", "Acton", "Copeland", "Barlow", "Reeves", "Clapham", "Skelton", "Rutherford", "Spaulding", "Jenkins"],
//
//     generated: ["$firstName", "$firstName $lastName", "$firstName \"$nickName\" $lastName"],
//     firstName: ["$title $genFirst", "$genFirst"],
//     lastName: ["$genLast", "$genLast$suffix"],
//     nickName: ["Lefty", "Lucky", "Salty", "Patches", "Bob", "The Knife", "Snake Eyes", "Hook", "The Butcher", "Strider"],
//
//     title: ["$nobleTitle", "$descriptiveTitle"],
//         nobleTitle: ["Lord", "Lady", "Baron", "Baroness", "Sir", "Dame", "Count", "Countess", "Big Kahuna"],
//         descriptiveTitle: ["Honest", "Old Man", "Little", "Big", "Old"],
//
//     suffix: [" the $suffixAdj", ", Senior", ", Junior", " alias $firstName"],
//         suffixAdj: ["Second", "Third", "Fearless", "Ruthless", "Bold", "Merciful", "Knife", "Lesser", "Great", "Red", "Black", "Pale",
//                     "Dark One", "Quick", "Mighty", "Rat", "Cursed", "Ready", "Stoic", "Mad", "Elder", "Younger"],
//
//     genFirst: [/*"&cap{$syllable}$post", "$pre$syllable$post", "$pre$syllable",*/ "&cap{$syllable}"/*, "&cap{$syllable}$syllable"*/,
//                "$genFirst $genFirst"],
//         pre: ["Ak-", "Dero", "Cal", "Tal-", "Sa", "Per", "Mak-", "Al-", "Lis"],
//         // pronounceable anywhere
//         // A: ["al", "ne", "er", "ash", "an", "ot", "an", "i", "or", "ty", "az", "az", "on", "ar", "an", "ol", "ik",
//         //   "er", "ahn", "a", "e", "i", "o", "u", "y", "ek", "ak", "els", "int", "osh", "ish", "an", "en", "in", "on",
//         //   "un", "$A$A"],
//         // pronounceable before/after pronounceable anywhere
//         // B: ["st", "pr", "sh", "mr", "jh", "sp", "tr", "sw", "br", "bl", "ch",  "cl", "cr", "ly", "$A$B$A"],
//         // pronounceable after pronounceable anywhere
//         // C: ["nd", "ng", "ct", "tch", "nts", "ntz", "$A$C"],
//         V: ["a", "e", "i", "o", "u", "y", "ae", "ai", "ao", "au", "ea", "ee", "ei", "eo", "eu", "ia", "ie", "io", "iu", "oa", "oe",
//             "oi", "oo", "ou", "ua", "ue", "ui", "uo", "$V$ENDC$V"],
//         C: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z",
//             "bh", "bj", "bl", "br", "bw",
//             "ch", "cl", "cr", "cw",
//             "dh", "dr", "dw",
//             "fh", "fj", "fl", "fr", "fw",
//             "gh", "gl", "gn", "gr", "gw",
//             "hr", "hw",
//             "jh", "jr",
//             "kh", "kl", "kn", "kr", "ks", "kv", "kw",
//             "ll",
//             "mb", "mn", "mr", "mw",
//             "ng", "nr",
//             "pf", "ph", "pl", "pn", "pr", "ps", "pt", "pw",
//             "qh", "qr", "qu", "qw",
//             "rh", "rw",
//             "sb", "sc", "sf", "sh", "sk", "sl", "sm", "sn", "sp", "squ", "st", "sv", "sw",
//             "th", "tr", "ts", "tw",
//             "vh", "vl", "vr", "vw",
//             "wh", "wr",
//             "xh",
//             "zh", "zl", "zr", "zw", "$C$V$C"],
//         // syllable: ["$A", "$B$A", "$A$B", "$B$A$B", "$A$C", "$B$A$C"],
//         ENDC: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z",
//                "bb", "bf", "bh", "bn", "br", "bs", "bt", "bz",
//                "cc", "ch", "ck", "ct", "cz",
//                "dd", "dh", "ds", "dt", "dz",
//                "ff", "fh", "fs", "ft", "fz",
//                "gf", "gg", "gh", "gm", "gn", "gr", "gs", "gz",
//                "hb", "hc", "hd", "hf", "hg", "hj", "hk", "hl", "hm", "hn", "hr", "hs", "ht", "hv", "hx", "hz",
//                "jh", "jj", "jr",
//                "kf", "kh", "kk", "kr", "ks", "kt", "kz",
//                "lb", "ld", "lf", "lg", "lh", "lj", "lk", "ll", "lm", "ln", "lp", "ls", "lt", "lv", "lx", "lz",
//                "mb", "md", "mf", "mh", "mm", "mn", "mp", "mr", "ms", "mt", "mz",
//                "nc", "ng", "nk", "nn", "nr", "ns", "nt", "nz",
//                "pf", "ph", "pp", "ps", "pt", "pz",
//                "qh", "qq", "qs", "qt", "qz",
//                "rb", "rc", "rd", "rf", "rg", "rh", "rk", "rl", "rm", "rn", "rp", "rr", "rs", "rt", "rv", "rx", "rz",
//                "sc", "sh", "sk", "sm", "sp", "sq", "ss", "st",
//                "tch", "th", "tl", "tt", "ts", "tz",
//                "vh", "vs", "vv", "vz",
//                "wd", "wf", "wg", "wh", "wk", "wl", "wm", "wn", "wp", "wq", "ws", "wt", "wv", "wx", "wz",
//                "xh", "xt", "xx",
//                "zd", "zh", "zl", "zm", "zr", "zt", "zz", "$ENDC$V$ENDC"],
//         // syllable: ["$V$ENDC", "$C$V", "$V$C$V$ENDC", "$V$C$V", "$V$ENDC$V", "$C$V$ENDC"],
//         syllable: ["$V$ENDC", "$C$V"],
//         post: ["ion", "iel", "han", "ius", "os", "an", "or", "thor", "en", "len", "ia", "oa", "ov", "iev", "ita", "ino", "asta", "on",
//                "in", "us", "ek", "ham", "er", "ir", "ur", "os", "ix", "ox", "ex", "ax", "it", "et", "der", "ene", "o", "a", "est"],
//
//     genLast: ["$genFirst", "$descriptiveLast"/*, "$occupationalLast"*/],
//         descriptiveLast: ["$firstCompound$secondCompound"],
//             firstCompound: ["Strong", "Red", "Long", "Bone", "Lead", "Good", "Gold", "Green", "Silver", "Black", "One", "Iron", "Stone",
//                             "Steel", "Deep", "Goblin", "Tree", "Foe", "Rock", "Fae", "Dwarf", "Goblin", "Elf", "Drake", "Dragon", "Orc",
//                              "Night", "Wight", "Fiend", "Snake", "Worm", "Wyrm", "Half", "Bog", "Marsh", "Dune", "Shadow", "Bright", "Wind",
//                              "Earth", "Sky", "Fire", "Flame", "Water", "Wave", "Mud", "Soot", "Smoke", "Fell", "Silk", "Potato", "Shade", "Hob",
//                              "Troll", "Wolf", "Grim", "Dune", "Hill", "Grey", "Crag", ""],
//             secondCompound: ["fellow", "friend", "shanks", "butcher", "hunter", "man", "bane", "ripper", "tongue", "arm", "reach", "tooth", "eye",
//                         "foot", "hand", "grave", "seeker", "finder", "killer", "ender", "crusher", "born", "walker",
//                         "strider", "watcher", "keeper", "shod", "shot", "eater", "nose", "smith", "tamer", "rider", "fodder"],
//         // occupationalLast: ["Archer", "Fletcher", "Cooper", "Smith", "Reeve", "Wainwright", "Tanner", "Hunter", "Miller", "Baker"]
// };

let gen = new CFGGenerator(humanNames);

class GeneratorPage extends Component<IPage, {}> {

    name: string;

    render() {

        let name = gen.expand("root").text;

        return (
            <div className="generator-page padding-15">
                <h1>Generator</h1>
                <div className="content">
                  <p className="name" id="name">{name}</p>
                  <button className="btn btn-default" onClick={this.reroll.bind(this)}>Reroll</button>
                </div>
            </div>
        );
    }

    reroll()
    {
      this.name = gen.expand("root").text;
      document.getElementById("name").innerText = this.name;
    }
}

export default GeneratorPage;