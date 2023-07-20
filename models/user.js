/* eslint-disable */
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');


const  userSchema = new Schema(
    {
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
         // eslint-disable-next-line
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please, fill a valid email address'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: "",
    },
    avatarURL: {
        type: String,
    }
    }, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError); 

const User = model("user", userSchema);  


module.exports = User;   