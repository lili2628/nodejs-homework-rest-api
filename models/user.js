const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

 const emailRegExp = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please, fill a valid email address'];

const  userSchema = new Schema(
    {
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegExp,
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String
    }, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError); 

const User = model("user", userSchema);  


module.exports = User;   