import mongoose from 'mongoose';

import User from './schemas/user';
import Campaign from './schemas/campaign';
import Character from './schemas/character';
import Note from './schemas/note';

const uri = "mongodb+srv://gmuser:gm-tools@gm-tools-ig9xf.mongodb.net/gm-tools";

mongoose.connect(uri);

const mongo = mongoose.connection;

mongo.once("open", () => console.log(`Connected to ${mongo.db.databaseName}`));

mongo.on("error", err => console.error(`Connection error:`, err));

const models = {
   User,
   Campaign,
   Character,
   Note
};

export default models;