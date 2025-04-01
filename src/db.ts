import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username : {type : String, unique : true},
    password : String
});

export const UserModel = model("User", UserSchema);


const ContentSchema = new Schema({
    link : String,
    title: String,
    tags : [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId : {type: mongoose.Types.ObjectId, ref: 'User', require: true}
});

export const ContentModel = model("Content", ContentSchema);

const shareSchema = new Schema({
    hash : String,
    userId : {type: mongoose.Types.ObjectId, ref: 'User', require: true, unique: true }
});

export const LinkModel = model("Link", shareSchema);