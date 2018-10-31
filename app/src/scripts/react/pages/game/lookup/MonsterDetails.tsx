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
    }

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
                    <li><strong>STR</strong>{monster.str}</li>
                    <li><strong>DEX</strong>{monster.dex}</li>
                    <li><strong>CON</strong>{monster.con}</li>
                    <li><strong>INT</strong>{monster.int}</li>
                    <li><strong>WIS</strong>{monster.wis}</li>
                    <li><strong>CHA</strong>{monster.cha}</li>

                </ul>
                <div className="divider"></div>
                <ul className="color-text">
                    <li><strong>Skills</strong> {monster.skill}</li>
                    <li><strong>Senses</strong> {monster.senses}</li>
                    <li><strong>Languages</strong> {monster.languages}</li>
                    <li><strong>Challenge</strong> {monster.cr} ({xpByChallengeRating[monster.cr]} XP)</li>
                </ul>
                <div className="divider"></div>
                {renderTraits(monster.trait)}
            </div>
        </div>
    );
}

export default MonsterDetails;