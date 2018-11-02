import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from './db/models';
import { ICharacter } from "./db/schemas/character";
import { IUser } from "./db/schemas/user";

export default class CharacterHandler extends Handler{
    handleEvent(eventType:string, event:any): Promise<EventWrapper[]>{
        switch(eventType){
            case 'data.persist': return this.saveCharacter(event);
            default:
                return new Promise<EventWrapper[]>((resolve,reject) => {
                    reject("Unrecognized operation for character: " + eventType);
                });
        }
    }

    /*
    Saves a character. This can be a new character or an update to one
    that already exists.
    */
    private saveCharacter(event:any): Promise<EventWrapper[]> {
        switch(event.key){
            case 'new_character': return this.newCharacter(event);
            default:
                return new Promise<EventWrapper[]>((resolve,reject) => {
                    reject("Unrecognized key for character: " + event.key);
                });
        }
    }

    /*
    Creates a new character for a user. It doesn't check if they already have
    one with that name.
    */
    private newCharacter(event:any):Promise<EventWrapper[]>{
        return new Promise<EventWrapper[]>((resolve, reject) => {
            // Get user id for the character
            models.User.findOne({id: event.data.userid}).then(function(user:IUser){
                // Generate object to save to database
                let character = {
                    name: event.data.name,
                    user: user._id
                };
                // Save object
                models.Character.create(character).then(function(doc:ICharacter){
                    if(doc === null){
                        // Save operation failed, reject promise
                        reject("Save operation failed.")
                    } else {
                        // Save operation succeeded, resolve with data.persisted event
                        let successEvent = {
                            namespace: event.namespace,
                            key: event.key,
                            data: doc
                        };
                        let userids = [event.data.userid]
                        let wrapper = new EventWrapper(userids, successEvent, "data.persisted");
                        let wrappers = [wrapper];
                        resolve(wrappers);
                    }
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });            
        });
    }
}