import React, { SFC } from "react";
import { sizes, xpByChallengeRating } from "./dictionary";

interface MonsterDetailsProps {
    monster:any,
    id:any
    openTab:any
}


const MonsterDetails: SFC<MonsterDetailsProps> = (props) => {
    const { monster } = props;
    console.log(monster);

    function formatModifier(modifier:number) {
        return (modifier >= 0 ? '+' : '') + modifier;
    }

    function getModifier(attributeScore:number) {
        return formatModifier(Math.floor(attributeScore/2 - 5))
    }

    const renderTraits = (traits:any) => {
        if (!traits) return null;
        // handles case where 'trait' is a single object, not an array
        if (traits && traits.length === undefined) traits = [ traits ];
        if (traits.length > 0) {
            return (
                <ul>
                {traits.map((trait:any) => {
                    return (
                        <li key={trait.name}>
                            <strong>{trait.name}.</strong> {trait.text}
                        </li>
                    );
                })}
                </ul>
            );
        }
        return null;
    };

    const renderActions = (title:string, actions:any) => {
        if (!actions) {
            return null;
        }
        // Make sure the actions is an array
        if (!Array.isArray(actions)) {
            actions = [ actions ];
        }

        if (actions.length > 0) {
            return (
                <div>
                    <h3>{title}</h3>
                    {actions.map((action:any) => {
                        return (
                            <p key={action.name}>
                                <strong><em>{action.name}.</em></strong> {action.text}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="details-page">
            <div className="panel">
                <button type="button" 
                    onClick={props.openTab.bind(null, {text: monster.name, path: `/game/lookup/creatures/${props.id}`, icon: "https://i1.wp.com/www.pixelmatortemplates.com/wp-content/uploads/2014/11/cartoon-icon-final.jpg"})}
                    >
                    Pin
                </button>
                <h2>{monster.name}</h2>
                <i>{`${sizes[monster.size]} ${monster.type}, ${monster.alignment}`}</i>
                <div className="divider"></div>
                <ul className="color-text">
                    <li><strong>Armor class</strong> {monster.ac}</li>
                    <li><strong>Hit Points</strong> {monster.hp}</li>
                    <li><strong>Speed</strong> {monster.speed}</li>
                </ul>
                <div className="divider"></div>
                <ul className="ul-horizontal color-text">
                    <li><strong>STR</strong>{monster.str} ({getModifier(monster.str)})</li>
                    <li><strong>DEX</strong>{monster.dex} ({getModifier(monster.dex)})</li>
                    <li><strong>CON</strong>{monster.con} ({getModifier(monster.con)})</li>
                    <li><strong>INT</strong>{monster.int} ({getModifier(monster.int)})</li>
                    <li><strong>WIS</strong>{monster.wis} ({getModifier(monster.wis)})</li>
                    <li><strong>CHA</strong>{monster.cha} ({getModifier(monster.cha)})</li>

                </ul>
                <div className="divider"></div>
                <ul className="color-text">
                    {monster.save && <li><strong>Saving Throws</strong> {monster.save}</li>}
                    {monster.skill && <li><strong>Skills</strong> {monster.skill}</li>}
                    {monster.vulnerable && <li><strong>Damage Vulnerabilities</strong> {monster.vulnerable}</li>}
                    {monster.resist && <li><strong>Damage Resistances</strong> {monster.resist}</li>}
                    {monster.immune && <li><strong>Damage Immunities</strong> {monster.immune}</li>}
                    {monster.conditionImmune && <li><strong>Damage Immunities</strong> {monster.conditionImmune}</li>}
                    <li><strong>Senses</strong> {monster.senses && monster.senses + ','} passive Perception {monster.passive}</li>
                    {monster.languages && <li><strong>Languages</strong> {monster.languages}</li>}
                    <li><strong>Challenge</strong> {monster.cr} ({xpByChallengeRating[monster.cr]} XP)</li>
                </ul>
                <div className="divider"></div>
                {renderTraits(monster.trait)}
                {renderActions("Actions", monster.action)}
                {renderActions("Reactions", monster.reaction)}
                {renderActions("Legendary Actions", monster.legendary)}
            </div>
        </div>
    );
};

export default MonsterDetails;