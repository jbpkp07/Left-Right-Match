import mongoose, { Document, Model, Schema } from "mongoose";

import { IStance } from "./Candidate";

export interface ICandidateMatch {

    name: string;
    img: string;
    percentageMatch: number;
}

export interface IUser {

    name: string;
    email: string;
    password: string;
    stances: IStance[];
    matches: ICandidateMatch[];
}

export interface IUserDoc extends IUser, Document { }

const UserSchema: Schema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true    // enforcing unique user emails
    },
    password: {
        type: String,
        required: true
    },
    stances: [{
        key: {
            type: String,
            required: true
        },
        stance: {
            type: String,
            required: true
        }
    }],
    matches: [{
        name: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        percentageMatch: {
            type: Number,
            required: true
        }
    }]
});

export const Users: Model<IUserDoc> = mongoose.model("User", UserSchema);