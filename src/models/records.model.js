/* eslint-disable max-len */
import {Schema, model} from 'mongoose';

const schema = new Schema({
    id: Number,
    firstname: String,
    lastname: String,
    email: String,
    email2: String,
    profession: String,
});
let Records = model('records', schema);
export default Records;
