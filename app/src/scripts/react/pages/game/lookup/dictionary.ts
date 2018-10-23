export const alignments:object = {
    'lawful good': 'LG',
    'neutral good': 'NG',
    'chaotic good': 'CG',
    'lawful neutral': 'LN',
    'neutral': 'N',
    'unaligned': '—',
    'chaotic neutral': 'CN',
    'lawful evil': 'LE',
    'neutral evil': 'NE',
    'chaotic evil': 'CE'
};

export const attackKeyWords:object = {
    'Melee or Ranged Weapon Attack: ': 'M/R W ATT',
    'Melee Weapon Attack: ': 'M W ATT',
    'Melee Spell Attack: ': 'M S ATT',
    'Ranged Weapon Attack: ': 'R W ATT',
    'Ranged Spell Attack: ': 'R S ATT'
};

export const attributes:object = {
    'str': 'S',
    'dex': 'D',
    'con': 'C',
    'int': 'I',
    'wis': 'W',
    'cha': 'Ch'
};

export const conditions:object = {
    'vulnerable': 'Damage Vulnerabilities',
    'resist': 'Damage Resistances',
    'immune': 'Damage Immunities',
    'conditionImmune': 'Condition Immunities'
};

export const sizes:object = {
    'T': 'Tiny',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'H': 'Huge',
    'G': 'Gargantuan'
};

export const xpByChallengeRating:object = {
    '0': '10',
    '1/8': '25',
    '1/4': '50',
    '1/2': '100',
    '1': '200',
    '2': '450',
    '3': '700',
    '4': '1,100',
    '5': '1,800',
    '6': '2,300',
    '7': '2,900',
    '8': '3,900',
    '9': '5,000',
    '10': '5,900',
    '11': '7,200',
    '12': '8,400',
    '13': '10,000',
    '14': '11,500',
    '15': '13,000',
    '16': '15,000',
    '17': '18,000',
    '18': '20,000',
    '19': '22,000',
    '20': '25,000',
    '21': '33,000',
    '22': '41,000',
    '23': '50,000',
    '24': '62,000',
    '25': '75,000',
    '26': '90,000',
    '27': '105,000',
    '28': '120,000',
    '29': '135,000',
    '30': '155,000'
};

/*
(function(forEach) {
    // Monsters object
    function Monsters() {

        // Setup some variables


            monsters = {};
        var emphasis = ['Hit: '];
        forEach(attackKeyWords, function(keyword) {
            emphasis.push(keyword);
        });

        // Formatters
        function HTMLFormatter() {
            function buildAbilityDescription(desc) {
                forEach(emphasis, function (i, str) {
                    desc = desc.replace(str, '<em>' + str.trim() + '</em> ');
                });
                return desc;
            }

            function buildAction(ability, strongOnly, compact) {
                var startHeader = '<strong>';
                var endHeader = '</strong>';
                if (!strongOnly) {
                    startHeader += '<em>';
                    endHeader = '</em>' + endHeader;
                }
                var action = startHeader + ability.name + '. ' + endHeader;
                if ('text' in ability && !compact) {
                    if (Array.isArray(ability.text)) {
                        forEach(ability.text, function(i, txt) {
                            action += buildAbilityDescription(txt) + '<br/>';
                        });
                    } else {
                        action += buildAbilityDescription(ability.text) + '<br/>';
                    }
                }
                if ('attack' in ability && compact) {
                    if (Array.isArray(ability.attack)) {
                        forEach(ability.attack, function(i, attack) {
                            action += buildCompactAttack(attack, true) + ' ';
                        })
                    } else {
                        action += buildCompactAttack(ability.attack);
                    }
                    action += '<br/>';
                }
                return action;
            }

            function buildActionList(listName, monster, title, strongOnly, compact) {
                var actionList = '';
                if (listName in monster) {
                    if (title) {
                        if (compact) {
                            actionList += '<strong><em>' + title + ': </em></strong>';
                        } else {
                            actionList += '<h3>' + title + '</h3>';
                        }
                    }
                    if (Array.isArray(monster[listName])) {
                        forEach(monster[listName], function(i, ability) {
                            actionList += buildAction(ability, strongOnly, compact);
                        });
                    } else {
                        actionList += buildAction(monster[listName], strongOnly, compact);
                    }
                    if (compact && actionList.length > 5 && actionList.substring(actionList.length - 5) !== '<br/>') {
                        actionList += '<br/>';
                    }
                }
                return actionList;
            }

            function buildAttributes(monster) {
                var attr = '', value;
                forEach(attributes, function(attribute) {
                    value = monster[attribute];
                    attr += '<td>' + value + ' (' + getModifier(value) + ')</td>'
                });
                return attr;
            }

            function buildCompactAttack(attack, showName) {
                var action = '';
                var attackParts = attack.split('|');
                if (attackParts.length >= 3) {
                    if (showName) {
                        action += attackParts[0] + ' ';
                    }
                    if (attackParts[1]) {
                        action += '+' + attackParts[1]+ ' ';
                    }
                    action += attackParts[2];
                } else {
                    action += ability.attack;
                }
                return action;
            }

            function buildCompactAttributes(monster) {
                var attr = '';
                forEach(attributes, function(attribute, abbrev) {
                    attr += '<strong>' + abbrev + '</strong> ' + getModifier(monster[attribute]) + ' '
                });
                return attr;
            }

            function buildExtras(monster, compact) {
                var extras = '<ul>';

                // Saving throws
                if (monster.save) {
                    extras += '<li>';
                    if (!compact) {
                        extras += '<strong>Saving Throws</strong> '
                    }
                    extras += monster.save + '</li>';
                }

                // Skills
                if (monster.skill) {
                    extras += '<li>';
                    if (!compact) {
                        extras += '<strong>Skills</strong> '
                    }
                    extras += monster.skill + '</li>';
                }

                // Conditions
                forEach(conditions, function(condition, name) {
                    if (condition in monster && monster[condition]) {
                        extras += '<li><strong>' + name + '</strong> ' + monster[condition] + '</li>';
                    }
                });

                // Senses
                if (compact) {
                    if (monster.senses) {
                        extras += '<li>' + monster.senses + '</li>';
                    }
                } else {
                    extras += '<li><strong>Senses</strong> ';
                    if (monster.senses) {
                        extras += monster.senses + ', ';
                    }
                    extras += 'passive Perception ' + monster.passive + '</li>';
                }

                if (!compact) {
                    extras += '<li><strong>Languages</strong> ' + (monster.languages ? monster.languages : '—') + '</li>';
                    extras += '<li><strong>Challenge</strong> ' + monster.cr + ' (' + xpByChallengeRating[monster.cr] + ' XP)</li>';
                }

                return extras + '</ul>';
            }

            function buildCompactActions(monster) {
                var actions =  buildActionList('trait', monster, 'Traits', true, true) +
                    buildActionList('legendary', monster, 'Legendary', true, true) +
                    buildActionList('reaction', monster, 'Reactions', true, true) +
                    buildActionList('action', monster, '', true, true);

                // Trim any trailing breaks
                while (actions.substring(actions.length - 5) === '<br/>') {
                    actions = actions.substring(0, actions.length - 5);
                }
                return actions;
            }

            function buildCompactTemplate(monster) {
                // SEE: http://theangrygm.com/abbreviate-stat-blocks/
                var extras = buildExtras(monster, true);
                if (extras === "<ul></ul>") {
                    extras = "";
                } else {
                    extras += '<hr>';
                }
                return '<div class="monster compact">' +
                    '<p>' + monster.name +
                    ' (' + sizes[monster.size] + ' ' + alignments[monster.alignment] + ' ' + getType(monster.type, true) + ')' +
                    ' (CR ' + monster.cr + ')</p><hr>' +
                    '<p><strong>AC</strong> ' + truncateToParentheses(monster.ac) +
                    ' <strong>HP</strong> ' + truncateToParentheses(monster.hp) +
                    ' <strong>SPD</strong> ' + monster.speed + '</p>' +
                    '<p>' + buildCompactAttributes(monster) + '</p><hr>' +
                    extras +
                    '<p>' + buildCompactActions(monster) + '</p>' +
                    '</div>';
            }

            function buildFullTemplate(monster) {
                return '<div class="monster">' +
                    '<h2>' + monster.name + '</h2>' +
                    '<p><em>' + sizes[monster.size] + ' ' + getType(monster.type) + ', ' + monster.alignment + '</em></p>' +
                    '<hr>' +
                    '<ul>' +
                    '<li><strong>Armor Class</strong> ' + monster.ac + '</li>' +
                    '<li><strong>Hit Points</strong> ' + monster.hp + '</li>' +
                    '<li><strong>Speed</strong> ' + monster.speed + '</li>' +
                    '</ul>' +
                    '<hr>' +
                    '<table>' +
                    '<thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>' +
                    '<tbody><tr>' + buildAttributes(monster) + '</tr></tbody>' +
                    '</table>' +
                    '<hr>' +
                    buildExtras(monster) +
                    '<hr>' +
                    buildActionList('trait', monster) +
                    buildActionList('action', monster, 'Actions') +
                    buildActionList('legendary', monster, 'Legendary Actions', true) +
                    buildActionList('reaction', monster, 'Reactions') +
                    '</div>';
            }

            function getType(type, compact) {
                var typeName = type;
                if (compact) {
                    var loc = type.indexOf('(');
                    if (loc > 0) {
                        typeName = typeName.substring(0, loc);
                    }
                }

                return typeName
            }

            function truncateToParentheses(str) {
                var loc = str.indexOf('(');
                if (loc > 0) {
                    return str.substring(0, loc);
                } else {
                    return str;
                }
            }

            function buildTemplate(monster, compact) {
                if (monster) {
                    if (compact) {
                        return buildCompactTemplate(monster);
                    } else {
                        return buildFullTemplate(monster);
                    }
                }
                return '';
            }

            return buildTemplate;
        }

        function MarkdownFormatter() {
            function getAttributes(monster) {
                var markdown = '|';
                var value;
                forEach(attributes, function(attribute) {
                    value = monster[attribute];
                    markdown += value + ' (' + getModifier(value) + ')|';
                });
                return markdown;
            }

            function getExtras(monster) {
                var markdown = '', list;

                // Saving throws
                if (monster.save) {
                    // Save the list, after trimming the trailing ', '
                    markdown += '\n> - **Saving Throws** ' + monster.save;
                }

                // Skills
                if (monster.skill) {
                    // Save the list, after trimming the trailing ', '
                    markdown += '\n> - **Skills** ' + monster.skill;
                }

                // Conditions
                for (var condition in conditions) {
                    if (conditions.hasOwnProperty(condition) && (condition in monster) && (monster[condition])) {
                        markdown += '\n> - **' + conditions[condition] + '** ' + monster[condition];
                    }
                }

                // Senses
                markdown += '\n> - **Senses** ';
                if (monster.senses) {
                    markdown += monster.senses + ', ';
                }
                markdown += 'passive Perception ' + monster.passive;

                markdown += '\n> - **Languages** ' + (monster.languages ? monster.languages : '—')
                    + '\n> - **Challenge** ' + monster.cr
                    + ' (' + xpByChallengeRating[monster.cr] + ' XP)';

                return markdown;
            }

            function formatAbilityDesc(desc) {
                forEach(emphasis, function(i, str) {
                    desc = desc.replace(str, '_' + str.trim() + '_ ');
                });
                return desc;
            }

            function formatAction(ability, headerFormat) {
                if (!headerFormat) {
                    headerFormat = '***';
                }

                var markdown = '\n> ' + headerFormat + ability.name + '.' + headerFormat;
                if (typeof ability === 'object' && 'text' in ability) {
                    if (Array.isArray(ability.text)) {
                        forEach(ability.text, function(i, txt) {
                            markdown += ' ' + formatAbilityDesc(txt) + '\n>';
                        });
                    } else {
                        markdown += ' ' + formatAbilityDesc(ability.text) + '\n>';
                    }
                } else {
                    markdown += '\n>';
                }

                return markdown;
            }

            function getActionList(listName, monster, title, headerFormat) {
                var markdown = '';
                if (listName in monster) {
                    if (title) {
                        markdown += '\n> ### ' + title;
                    }
                    if (Array.isArray(monster[listName])) {
                        forEach(monster[listName], function (i, ability) {
                            markdown += formatAction(ability, headerFormat);
                        });
                    } else {
                        markdown += formatAction(monster[listName], headerFormat);
                    }
                }
                return markdown;
            }

            function getMarkdown(monster) {
                if (monster) {
                    return '___\n' +
                        '> ## ' + monster.name + '\n' +
                        '>*' + sizes[monster.size] + ' ' + monster.type + ', ' + monster.alignment + '*\n' +
                        '>___\n' +
                        '> - **Armor Class** ' + monster.ac + '\n' +
                        '> - **Hit Points** ' + monster.hp + '\n' +
                        '> - **Speed** ' + monster.speed + '\n' +
                        '>___\n' +
                        '>|STR|DEX|CON|INT|WIS|CHA|\n' +
                        '>|:---:|:---:|:---:|:---:|:---:|:---:|\n' +
                        '>' + getAttributes(monster) + '\n' +
                        '>___' +
                        getExtras(monster) + '\n' +
                        '>___' +
                        getActionList('trait', monster) +
                        getActionList('action', monster, 'Actions') +
                        getActionList('legendary', monster, 'Legendary Actions', '**') +
                        getActionList('reaction', monster, 'Reactions');
                }
                return '';
            }

            return getMarkdown;
        }

        // Global Functions
        function getMonsterName(name) {
            name = name.trim().toLowerCase();
            if (name in monsters) {
                // Exact match
                return name;

            } else if (name[name.length - 1] === 's') {
                // Handle plural version of the name //

                // Special cases
                if (name === 'wolves') {
                    return 'wolf';
                }

                // Default case, just drop the 's'
                name = name.substring(0, name.length - 1);
                if (name in monsters) {
                    return name;
                }
            }

            // No match
            return null;
        }

        function getMonster(name) {
            var monsterName = getMonsterName(name);
            if (monsterName) {
                return monsters[monsterName];
            } else {
                return null;
            }
        }

        function formatModifier(modifier) {
            return (modifier >= 0 ? '+' : '') + modifier;
        }

        function getModifier(attributeScore) {
            return formatModifier(Math.floor(attributeScore/2 - 5))
        }

        function formatIfNameExists(formatter) {
            return function(name, extra) {
                var monster = getMonster(name);
                if (monster) {
                    return formatter(monster, extra);
                } else {
                    return null;
                }
            };
        }

        var formats = {
            html: HTMLFormatter(),
            markdown: MarkdownFormatter()
        };

        // Return the object
        return {
            /**
             * Takes a dnd5tools monster object list.
             * See: https://github.com/Radai/dnd5tools/blob/master/data.json
             *//*
            add: function(bestiary) {
                // Store the monsters keyed by name
                var loc;
                forEach(bestiary, function(i, monster) {
                    // Extract the source from the type information
                    loc = monster.type.lastIndexOf(',');
                    if (loc > 0) {
                        monster.source = monster.type.substring(loc + 1).trim();
                        monster.type = monster.type.substring(0, loc);
                    } else {
                        monster.source = '';
                    }

                    // Save keyed by lowercase name
                    monsters[monster.name.toLowerCase()] = monster;
                });
            },

            /**
             * Coverts a monster to homebrewery.naturalcrit.com markdown format.
             * @returns {string}
             *
            buildMarkdown: formats.markdown,
            buildMarkdownFor: formatIfNameExists(formats.markdown),

            /**
             * Converts a monster to an html statblock.
             *
            buildTemplate: formats.html,
            buildTemplateFor: formatIfNameExists(formats.html),

            getName: getMonsterName,
            getMonster: getMonster
        };
    }

    if ('angular' in window) {
        // Register as an angular module
        angular.module('co.5e.monsters', []).factory('bestiary', [Monsters]);
    } else if (module !== undefined) {
        module.exports = Monsters();
    } else {
        // Attach to the window
        window.bestiary5e = Monsters();
    }
})((function() {
    // Return a forEach function that provides the iterator function with key, value
    if ('jQuery' in window) {
        return jQuery.each;
    } else if ('angular' in window) {
        return function(obj, iter) {
            angular.forEach(obj, function (attr, key) {
                iter(key, attr);
            });
        };
    }
    if ('console' in window) {
        console.log('No forEach implementation detected. Falling back.');
    }
    return function simpleForEach(obj, iter) {
        var i, l;
        if (Array.isArray(obj)) {
            for (i = 0, l = obj.length; i < l; i++) {
                iter.call(iter, i, obj[i]);
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    iter.call(iter, i, obj[i])
                }
            }
        }
    };
})());*/