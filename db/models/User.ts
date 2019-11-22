import mongoose, { Document, Model, Schema } from "mongoose";

import { IStance } from "./Candidate";

export interface ILoginCreds {

    email: string;
    password: string;
}

export interface ISignupInfo {

    name: string;
    email: string;
    password: string;
}

export interface ISessionState {

    isLoggedIn: boolean;
    userId: string;
}

export interface ICandidateMatch {

    name: string;
    img: string;
    headImg: string;
    bannerImg: string;
    percentageMatch: number;
}

export interface IUser {

    _id: any;
    name: string;
    email: string;
    password: string;
    stances: IStance[];
    matches: ICandidateMatch[];
    __v?: number;
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
        _id: false,
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
        _id: false,
        name: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        headImg: {
            type: String,
            required: true
        },
        bannerImg: {
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