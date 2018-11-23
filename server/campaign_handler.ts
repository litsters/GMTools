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
    private addCharacter(event: any): Promise<EventWrapper[]> {
        const characterId = Types.ObjectId(event.data.character);
        const campaignId = Types.ObjectId(event.data.campaign);
        let character: ICharacter;
        let campaign: ICampaign;
        let user: IUser;

        // Add the campaign to the character
        return models.Character.findOneAndUpdate(
                { _id: characterId },
                { $addToSet: { campaigns: campaignId } },
                { new: true }
            ).exec()
            .then((c: ICharacter) => {
                // Save the character
                character = c;

                // Add the character to the campaign
                return models.Campaign.findOneAndUpdate(
                    { _id: campaignId },
                    { $addToSet: { characters: characterId, users: character.user } },
                    { new: true }
                    ).exec();
            })
            .then((c: ICampaign) => {
                // Save the campaign
                campaign = c;

                // Add the campaign to the user in case they are not already in the campaign
                return models.User.findOneAndUpdate(
                    { _id: character.user },
                    { $addToSet: { campaigns: campaign._id } },
                    { new: true }
                ).exec();
            })
            .then((u: IUser) => {
                // Save the updated user
                user = u;

                // Get the ids of all the users that need to be notified of the update event
                let mongoIds: Types.ObjectId[] = [
                    campaign.gm,
                ];
                campaign.users.forEach(id => mongoIds.push(id));

                return models.User.find({ _id: { $in: mongoIds } }).exec();
            })
            .then((users: IUser[]) => {
                // Return the events for this updated
                let updateCampaignEvent = {
                    namespace: event.namespace,
                    key: "campaign_updated",
                    data: campaign,
                };

                let updateCharacterEvent = {
                    namespace: "character",
                    key: "character_updated",
                    data: character,
                };
                let updateUserEvent = {
                    namespace: "user",
                    key: "current-data",
                    data: user
                };

                let userIds: string[] = users.map(u => u.id);

                return [
                    new EventWrapper(userIds, updateCampaignEvent, "data.persisted"),
                    new EventWrapper([event.userId], updateCharacterEvent, "data.persisted"),
                    new EventWrapper([event.userId], updateUserEvent, "data.retrieved"),
                ];
            });
    };

    /*
    Creates a new campaign for a user. It doesn't check if they already have
    one with that name.
    */
   private newCampaign(event: any): Promise<EventWrapper[]> {
       let campaign: ICampaign;

       // Get the user
       return models.User.findOne({ id: event.userId })
           .then((user: IUser) => {
               // Create and save the campaign to the data store
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

               // Add the campaign to the user
               return models.User.findOneAndUpdate(
                   { _id: c.gm },
                   { $push: { campaigns: campaign._id } },
                   { "new": true }
               ).exec();
           })
           .then((user: IUser) => {
               // Generate the events to send back
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