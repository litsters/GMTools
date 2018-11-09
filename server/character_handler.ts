import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from './db/models';
import { ICharacter } from "./db/schemas/character";
import { IUser } from "./db/schemas/user";

export default class CharacterHandler extends Handler{
    handleEvent(eventType:string, event:any): Promise<EventWrapper[]>{
        switch(eventType){
            case 'data.persist': return this.saveCharacter(event);
            case 'data.get': return this.getCharacter(event);
            default:
                return new Promise<EventWrapper[]>((resolve,reject) => {
                    reject("Unrecognized operation for character: " + eventType);
                });
        }
    }

    /*
    Gets a character. Note that we don't set the userids field in the
    Event Wrapper since we don't know who is requesting info.
    */
    private getCharacter(event:any): Promise<EventWrapper[]> {
        return new Promise<EventWrapper[]>((resolve, reject) => {
            // Get character data from mongo; key should be the character's mongo id
            let id = event.key;
            models.Character.findOne({_id: id}).then(function(character:ICharacter){
                // Generate event to send to client
                let successEvent = {
                    namespace: event.namespace,
                    key: "current-data",
                    data: character
                };

                let events:EventWrapper[] = [];
                let userids:string[] = [];
                events.push(new EventWrapper(userids, successEvent, "data.retrieved"));
                resolve(events);
            }).catch(function(err){
                reject(err);
            });
        });
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
                        // Update user with character
                        models.User.findOneAndUpdate({_id:user._id},{$push: {characters: doc._id}}).then(function(data:any){
                            let events:EventWrapper[] = [];

                            let userids = [event.data.userid];
                            // Save operation successful; send two events:
                            // one to acknowledge that the character was saved,
                            // another to update the user object with the new new character.
                            let characterSavedEvent = {
                                namespace: event.namespace,
                                key: event.key,
                                data: doc
                            };
                            events.push(new EventWrapper(userids, characterSavedEvent, "data.persisted"));

                            let updateUserEvent = {
                                namespace: "user",
                                key: "current-data",
                                data: data
                            };
                            events.push(new EventWrapper(userids, updateUserEvent, "data.retrieved"));

                            resolve(events);
                        }).catch(function(err){
                            reject(err);
                        });
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