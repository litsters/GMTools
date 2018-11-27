import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from "./db/models";
import { IUser } from "./db/schemas/user";
import { INote } from "./db/schemas/note";

export default class NoteHandler extends Handler {
    handleEvent(eventType:string, event:any): Promise<EventWrapper[]>{
        switch(eventType){
            case 'data.persist': return this.saveNote(event);
            case 'data.get': return this.getNote(event);
            default:
                return new Promise<EventWrapper[]>((resolve,reject) => {
                    reject("Unrecognized operation for note: " + eventType);
                });
        }
    }

    /*
    Gets the data for a note; event.key should be the note's mongo id
    */
    private getNote(event:any): Promise<EventWrapper[]>{
        return new Promise<EventWrapper[]>((resolve, reject) => {
            let id = event.key;

            models.Note.findOne({_id: id}).then(function(note:INote){
                // Create return event; don't worry about user id. This is
                // a get operation, so will only be returned to the client who
                // requested it.

                let successEvent = {
                    namespace: event.namespace,
                    key: "current-data",
                    data: note
                };

                let userids:string[] = [];
                let events:EventWrapper[] = [];
                events.push(new EventWrapper(userids, successEvent, "data.retrieved"));
                resolve(events);
            }).catch(function(err){
                reject(err);
            });
        });
    }

    /*
    Save a new note or update an existing one
    */
    private saveNote(event:any): Promise<EventWrapper[]>{
        switch(event.key){
            case 'new_note': return this.newNote(event);
            default:
                return new Promise<EventWrapper[]>((resolve, reject) => {
                    reject("Unrecognized operation for note persist: " + event.key);
                });
        }
    }

    /*
    Create a new note
    */
    private newNote(event:any): Promise<EventWrapper[]>{
        return new Promise<EventWrapper[]>((resolve, reject) => {
            // Get the mongo id for the user
            models.User.findOne({id: event.data.userid}).then(function(user:IUser){
                let note = {
                    content: event.data.content,
                    title: event.data.title,
                    author: user._id,
                    campaign: event.data.campaignid
                };

                // Add note to database
                models.Note.create(note).then(function(noteDoc:INote){
                    // Create success event
                    let successEvent = {
                        namespace: event.namespace,
                        key: event.key,
                        data: noteDoc
                    };

                    // Send to user who owns the note
                    let userids:string[] = [];
                    userids.push(event.data.userid);

                    let events:EventWrapper[] = [];
                    events.push(new EventWrapper(userids, successEvent, "data.persisted"));
                    resolve(events);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        });
    }
}