import {Document, Schema, Types, Model, model} from 'mongoose';

export interface INote extends Document {
    content: string,
    title: string,
    author: Types.ObjectId,
    campaign: Types.ObjectId
}

const NoteSchema = new Schema({
    content: Schema.Types.String,
    title: Schema.Types.String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
});

const Note = model<INote>('Note', NoteSchema);
export default Note;