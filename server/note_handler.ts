import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from "./db/models";
import { IUser } from "./db/schemas/user";
import { INote } from "./db/schemas/note";
import { ICampaign } from "./db/schemas/campaign";

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
    Gets the data for a note; event.key should be the note's mongo id;
    Alternatively, it could be a campaign id, in which case it will retrieve all
    of the user's notes for that campaign.
    */
    private getNote(event:any): Promise<EventWrapper[]>{
        return new Promise<EventWrapper[]>((resolve, reject) => {
            let id = event.key;

            models.Note.findOne({_id: id}).then(function(note:INote){
                if(!note){
                    // Note wasn't found; this may be a campaign id instead.
                    models.Campaign.findById(id).then(function(campaign:ICampaign){
                        if(!campaign) reject("No note or campaign found.");

                        // Find all notes that belong to the user
                        models.Note.find({author: event.userId, campaign: campaign._id}).then((notes:INote[]) => {
                            let successEvent = {
                                namespace: event.namespace,
                                key: "current-data",
                                data: {
                                    notes: notes
                                }
                            };

                            let userids:string[] = [event.userId];
                            let events:EventWrapper[] = [];
                            events.push(new EventWrapper(userids, successEvent, "data.retrieved"));
                            resolve(events);
                        }).catch(function(err){
                            reject(err);
                        });
                    });
                } else {
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
                }
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
            case 'update_note': return this.updateNote(event);
            case 'delete_note': return this.deleteNote(event);
            default:
                return new Promise<EventWrapper[]>((resolve, reject) => {
                    reject("Unrecognized operation for note persist: " + event.key);
                });
        }
    }

    /*
    Delete a note
    */
    private deleteNote(event:any): Promise<EventWrapper[]>{
        return models.Note.findByIdAndDelete(event.data.id).then((note:INote) => {
            let events:EventWrapper[] = [];

            // Return success message to user
            let successEvent = {
                namespace: event.namespace,
                key: "data-deleted",
                data: note
            };

            let userids = [event.userId];
            events.push(new EventWrapper(userids, successEvent, "data.persisted"));

            return events;
        });
    }

    /*
    Update an existing note
    */
    private updateNote(event:any): Promise<EventWrapper[]>{
        return models.Note.findOneAndUpdate({_id: event.data.id}, 
            {content: event.data.content, title: event.data.title},{new:true})
            .then((note:INote) => {

                // Return updated note to user
                let events:EventWrapper[] = [];

                let successEvent = {
                    namespace: event.namespace,
                    key: "current-data",
                    data: note
                };

                let userids = [event.userId];
                events.push(new EventWrapper(userids, successEvent, "data.persisted"));

                return events;
        }); 
    };

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
                    let userids:string[] = [event.data.userid];

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