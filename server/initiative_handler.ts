import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from './db/models';
import { ICharacter } from "./db/schemas/character";
import { IUser } from "./db/schemas/user";

export default class InitiativeHandler extends Handler{
    handleEvent(eventType:string, event:any): Promise<EventWrapper[]>{
        switch(eventType){
            case "initiative.turn": return this.continueInitiative(event);
            default:
                return new Promise<EventWrapper[]>((resolve, reject) => {
                    reject("Unknown command for initiative: " + eventType);
                });
        }
    }

    private continueInitiative(event:any):Promise<EventWrapper[]>{
        switch(event.key){
            case "next_turn":
                return this.nextTurn(event);
            default: 
                return new Promise<EventWrapper[]>((resolve, reject) => {
                    reject("Unknown key for initiative: " + event.key);
                });
        }
    }

    // Sends a notification to a player that it is their turn for initiative,
    // and a notification to the next player that their turn is coming up.
    private nextTurn(event:any):Promise<EventWrapper[]>{
        let currentId = event.data.current; // Mongo id of current character
        let nextId = event.data.next;       // Mongo id of next character

        // Get the characters from the database
        return models.Character.find({_id: { $in: [currentId, nextId]}}).exec()
            .then((characters:ICharacter[]) => {
                let users:any[] = [];
                characters.forEach((c:ICharacter) => {
                    users.push(c.user);
                });
                return models.User.find({_id: { $in: users}}).exec();
            })
            .then((players:IUser[]) => {
                let events:EventWrapper[] = [];

                // Determine which user is which, since
                // order is not guaranteed and some may not have been found
                let currentPlayer:IUser = null;
                let nextPlayer:IUser = null;

                players.forEach((p:IUser) => {
                    if(p.characters.includes(currentId)) currentPlayer = p;
                    if(p.characters.includes(nextId)) nextPlayer = p;
                });

                // Generate event for current player
                if(currentPlayer !== null){
                    let currentEvent = {
                        namespace: event.namespace,
                        key: "turn_start",
                        data: {
                            character: currentId
                        }
                    };
                    let userids:string[] = [currentPlayer.id];
                    events.push(new EventWrapper(userids, currentEvent, "initiative.start"));
                }

                // Generate event for next player
                if(nextPlayer !== null){
                    let nextEvent = {
                        namespace: event.namespace,
                        key: "turn_alert",
                        data: {
                            character: nextId
                        }
                    };
                    let userids:string[] = [nextPlayer.id];
                    events.push(new EventWrapper(userids, nextEvent, "initiative.alert"));
                }

                return events;
            });
    }
};