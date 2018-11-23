import Handler from "./handler_interface";
import EventWrapper from "./event";
import models from './db/models';
import { ICampaign } from "./db/schemas/campaign";
import { IUser } from "./db/schemas/user";
import { ICharacter } from "./db/schemas/character";
import { Types } from "mongoose";

export default class CampaignHandler extends Handler {
    handleEvent(eventType: string, event: any): Promise<EventWrapper[]> {
        switch(eventType){
            case 'data.persist':
                return this.saveCampaign(event);
            case 'data.get':
                return this.getCampaign(event);
            default:
                return Promise.reject("Unrecognized operation for campaign: " + eventType);
        }
    }

    /*
    Gets a campaign. Note that it doesn't set the userids field for the
    EventWrapper, since we don't know in here who is requesting information.
    */
    private getCampaign(event: any): Promise<EventWrapper[]> {
        switch (event.key) {
            case 'get_campaigns':
                // Get all campaigns for the user
                // First get the user's ID and then find all campaigns for that user's ID
                return models.User.findOne({ id: event.userId })
                    .then((user: IUser) => {
                        return models.Campaign.find({ _id: { $in: user.campaigns } }).exec();
                    })
                    .then((campaigns: ICampaign[]) => {
                        let successEvent = {
                            namespace: event.namespace,
                            key: event.key,
                            data: campaigns
                        };

                        let events:EventWrapper[] = [];
                        let userIds = [event.userId];

                        events.push(new EventWrapper(userIds, successEvent, "data.retrieved"));

                        return events;
                    });
            default:
                // Attempt to get the campaign by ID
                return models.Campaign.findById(event.key).exec()
                    .then((campaign: ICampaign) => {
                        let successEvent = {
                            namespace: event.namespace,
                            key: "current-data",
                            data: campaign
                        };

                        let events:EventWrapper[] = [];
                        let userids:string[] = [];
                        events.push(new EventWrapper(userids, successEvent, "data.retrieved"));

                        return events;
                    });
        }
    }

    /*
    Saves a campaign. This can be a new campaign or an update to one
    that already exists.
    */
    private saveCampaign(event: any): Promise<EventWrapper[]> {
        switch(event.key){
            case 'new_campaign':
                return this.newCampaign(event);
            case 'add_character':
                return this.addCharacter(event);
            case 'remove_character':
                return this.removeCharacter(event);
            default:
                return Promise.reject("Unrecognized key for campaign: " + event.key);
        }
    }

    /*
    Removes a character from a campaign. If the character isn't already
    in that campaign nothing is changed, but players still receive an 
    update.  Also, users are not automatically removed from campaigns
    when their characters are removed.
    */
    private removeCharacter(event: any): Promise<EventWrapper[]> {
        return new Promise<EventWrapper[]>((resolve,reject) => {
            let charId = event.data.character;
            let campId = event.data.campaign;

            // Remove character from campaign; this does not automatically
            // remove the user from the campaign, just their character
            models.Campaign.findOneAndUpdate({_id:campId},
                {$pull: {characters:charId}},{new:true}).then(function(campaign:ICampaign){
                    // Update users and GM that character has been removed

                    // Get mongo ids for the GM and players
                    let mongoIds:Types.ObjectId[] = [];
                    mongoIds.push(campaign.gm);
                    campaign.users.forEach(id => mongoIds.push(id));

                    // Build condition array
                    let conditions:any[] = [];
                    mongoIds.forEach(id => conditions.push({_id: id}));

                    // Get list of users from mongo
                    models.User.find({$or: conditions}).then(function(users:IUser[]){
                        // Build events to send to users
                        let userids:string[] = [];
                        users.forEach(user => userids.push(user.id));

                        let updateEvent = {
                            namespace: event.namespace,
                            key: "campaign_updated",
                            data: campaign
                        };

                        let events:EventWrapper[] = [];
                        events.push(new EventWrapper(userids, updateEvent, "data.persisted"));
                        resolve(events);
                    }).catch(function(err){
                        reject(err);
                    });
            }).catch(function(err){
                reject(err);
            });
        });
    };

    /*
    Adds a character to a pre-existing campaign, along with their associated user.
    */
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
   private newCampaign(event: any): Promise<EventWrapper[]> {
       let campaign: ICampaign;

       return models.User.findOne({ id: event.userId })
           .then((user: IUser) => {
               let campaign = {
                   name: event.data.name,
                   plugin: event.data.plugin,
                   gm: user._id,
               };

               return models.Campaign.create(campaign);
           })
           .then((c: ICampaign) => {
               if (c === null) {
                   throw "Save operation failed.";
               }
               campaign = c;

               return models.User.findOneAndUpdate(
                   { _id: c.gm },
                   { $push: { campaigns: campaign._id } },
                   { "new": true }
               ).exec();
           })
           .then((user: IUser) => {
               let userIds: string[] = [event.userId];

               let events: EventWrapper[] = [];
               let campaignSavedEvent = {
                   namespace: event.namespace,
                   key: event.key,
                   data: campaign,
               };
               events.push(new EventWrapper(userIds, campaignSavedEvent, "data.persisted"));

               let updatedUserEvent = {
                   namespace: "user",
                   key: "current-data",
                   data: user,
               };
               events.push(new EventWrapper(userIds, updatedUserEvent, "data.retrieved"));

               return events;
           });
   }
};