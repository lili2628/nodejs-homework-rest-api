/* eslint-disable */
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
         // eslint-disable-next-line
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please, fill a valid email address'],
    },
    phone: {
        type: String,
         // eslint-disable-next-line
        match: /^([+]?[0-9\s-\(\)]{3,25})*$/i,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleMongooseError); 

const Contact = model("contact", contactSchema);


module.exports = Contact;