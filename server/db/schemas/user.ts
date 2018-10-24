import {Document, Schema, Types, Model, model} from 'mongoose';


export interface IUser extends Document {
  id: string,
  nickname: string,
  characters: Types.ObjectId[],
  campaigns: Types.ObjectId[]
}

const UserSchema = new Schema({
  id: Schema.Types.String,
  nickname: Schema.Types.String,
  characters: { type: [Schema.Types.ObjectId], ref: 'Character' },
  campaigns: { type: [Schema.Types.ObjectId], ref: 'Campaign' }
});

const User = model<IUser>('User', UserSchema);
export default User;