import {Document, Schema, Types, Model, model} from 'mongoose';

export interface ICampaign extends Document {
  name: string,
  plugin: string,
  gm: Types.ObjectId,
  users: Types.ObjectId[],
  characters: Types.ObjectId[],
}

const CampaignSchema = new Schema({
  name: Schema.Types.String,
  plugin: Schema.Types.String,
  gm: { type: Schema.Types.ObjectId, ref: 'User' },
  users: { type: [Schema.Types.ObjectId], ref: 'User' },
  characters: { type: [Schema.Types.ObjectId], ref: 'Character' },
});

const Campaign = model<ICampaign>('Campaign', CampaignSchema);
export default Campaign;