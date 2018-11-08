import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from './db/models';
import { ICampaign } from "./db/schemas/campaign";
import { IUser } from "./db/schemas/user";
import { ICharacter } from "./db/schemas/character";
import { Types } from "mongoose";

export default class CampaignHandler extends Handler {
    handleEvent(eventType:string, event:any): Promise<EventWrapper[]>{
        switch(eventType){
            case 'data.persist': return this.saveCampaign(event);
            case 'data.get': return this.getCampaign(event);
            default:
                return new Promise<EventWrapper[]>((resolve,reject) => {
                    reject("Unrecognized operation for campaign: " + eventType);
                });
        }
    }

    /*
    Gets a campaign. Note that it doesn't set the userids field for the
    EventWrapper, since we don't know in here who is requesting information.
    */
    private getCampaign(event:any): Promise<EventWrapper[]>{
        return new Promise<EventWrapper[]>((resolve, reject) => {
            // Get campaign data from mongo
            // event key should be campaign id
            let campaignId = event.key;
            models.Campaign.findOne({_id: campaignId}).then(function(campaign:ICampaign){
                // Generate event to send to client
                let successEvent = {
                    namespace: event.namespace,
                    key: event.key,
                    data: campaign
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
    Saves a campaign. This can be a new campaign or an update to one
    that already exists.
    */
    private saveCampaign(event:any): Promise<EventWrapper[]> {
        switch(event.key){
            case 'new_campaign': return this.newCampaign(event);
            case 'add_character':return this.addCharacter(event);
            default:
                return new Promise<EventWrapper[]>((resolve,reject) => {
                    reject("Unrecognized key for campaign: " + event.key);
                });
        }
    }

    private addCharacter(event:any):Promise<EventWrapper[]>{
        return new Promise<EventWrapper[]>((resolve, reject) => {
            let charId = event.data.character;
            let campId = event.data.campaign;

            // Get user id for character
            models.Character.findOne({_id: charId}).then(function(character:ICharacter){
                let userid = character.user;

                // Add character to campaign
                models.Campaign.findOneAndUpdate({_id: campId},
                    {$addToSet: {characters: charId, users: userid}}, {new:true})
                    .then(function(campaign:ICampaign){
                        
                        // Update users and GM that character has been added to campaign
                        let updateEvent = {
                            namespace: event.namespace,
                            key: "campaign_updated",
                            data: campaign
                        };

                        // Get all user ids that need to be updated
                        let mongoIds:Types.ObjectId[] = [];
                        mongoIds.push(campaign.gm);
                        campaign.users.forEach(id => mongoIds.push(id));
                        
                        // Build $or condition array
                        let conditions:any[] = [];
                        mongoIds.forEach(id => conditions.push({_id: id}));

                        models.User.find({$or: conditions}).then(function(users:IUser[]){
                            let userids:string[] = [];
                            users.forEach(user => userids.push(user.id));

                            let events:EventWrapper[] = [];
                            events.push(new EventWrapper(userids, updateEvent, "data.persisted"));
                            resolve(events);
                        }).catch(function(err){
                            reject(err);
                        });
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        });
    };

    /*
    Creates a new campaign for a user. It doesn't check if they already have
    one with that name.
    */
   private newCampaign(event:any):Promise<EventWrapper[]>{
    return new Promise<EventWrapper[]>((resolve, reject) => {
        // Get user id
        models.User.findOne({id:event.data.userid}).then(function(user:IUser){
            // Create the campaign
            let campaign = {
                name: event.data.name,
                plugin: event.data.plugin,
                gm: user._id,
            };
            models.Campaign.create(campaign).then(function(createdCampaign:ICampaign){
                // Update the user so their campaign is listed
                models.User.findOneAndUpdate({_id:user._id},{$push: {campaigns: createdCampaign._id}},{new:true}).then(function(updatedUser:IUser){
                    // Return two events: one to update the user that their campaign
                    // has been successfully saved, another to update their user info
                    // in the client.
                    let userids:string[] = [event.data.userid];

                    let events:EventWrapper[] = [];
                    let campaignSavedEvent = {
                        namespace: event.namespace,
                        key: event.key,
                        data: createdCampaign
                    };
                    events.push(new EventWrapper(userids, campaignSavedEvent, "data.persisted"));

                    let updateUserEvent = {
                        namespace: "user",
                        key: "current-data",
                        data: updatedUser
                    };
                    events.push(new EventWrapper(userids, updateUserEvent, "data.retrieved"));

                    resolve(events);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
   }
};