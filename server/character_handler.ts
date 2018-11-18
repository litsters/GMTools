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
    private getCharacter(event: any): Promise<EventWrapper[]> {
        switch (event.key) {
            case 'get_characters':
                console.log('get_characters', event);
                // Get all characters for the user
                // First get the user's ID and then find all characters for that user's ID
                return models.User.findOne({ id: event.userId })
                    .then((user: IUser) => {
                        return models.Character.find({ user: user._id }).exec();
                    })
                    .then((characters: ICharacter[]) => {
                        let successEvent = {
                            namespace: event.namespace,
                            key: event.key,
                            data: characters
                        };

                        let events:EventWrapper[] = [];
                        let userIds = [event.userId];

                        events.push(new EventWrapper(userIds, successEvent, "data.retrieved"));

                        return events;
                    });
            default:
                // Attempt to get the character by ID
                return models.Character.findById(event.key).exec()
                    .then((character: ICharacter) => {
                        let successEvent = {
                            namespace: event.namespace,
                            key: "current-data",
                            data: character
                        };

                        let events:EventWrapper[] = [];
                        let userids:string[] = [];
                        events.push(new EventWrapper(userids, successEvent, "data.retrieved"));

                        return events;
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
    private newCharacter(event: any): Promise<EventWrapper[]> {
        let character: ICharacter;

        // Get the userid
        return models.User.findOne({ id: event.userId })
            .then((user: IUser) => {
                // Save the character
                const newCharacter = {
                    name: event.data.name,
                    user: user._id,
                };
                return models.Character.create(newCharacter);
            })
            .then((c: ICharacter) => {
                if (c === null) {
                    throw "Save operation failed."
                }
                character = c;

                // Update user with the character Id
                return models.User.findOneAndUpdate(
                    { _id: character.user },
                    { $push: { characters: character._id }}
                    ).exec();
            })
            .then((data: any) => {
                // Success
                let events:EventWrapper[] = [];

                let userids = [event.userId];
                // Save operation successful; send two events:
                // one to acknowledge that the character was saved,
                // another to update the user object with the new new character.
                let characterSavedEvent = {
                    namespace: event.namespace,
                    key: event.key,
                    data: character
                };
                events.push(new EventWrapper(userids, characterSavedEvent, "data.persisted"));

                let updateUserEvent = {
                    namespace: "user",
                    key: "current-data",
                    data: data
                };
                events.push(new EventWrapper(userids, updateUserEvent, "data.retrieved"));

                return events;
            });
    }
}