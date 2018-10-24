import {Document, Schema, Types, Model, model} from 'mongoose';

export interface ICharacter extends Document {
  name: string,
  user: Types.ObjectId,
  campaigns: Types.ObjectId[]
}

const CharacterSchema = new Schema({
  name: Schema.Types.String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  campaigns: { type: [Schema.Types.ObjectId], ref: 'Campaign' }
});

const Character = model<ICharacter>('Character', CharacterSchema);
export default Character;