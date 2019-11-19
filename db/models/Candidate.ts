import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStance {

    key: string;
    question?: string;
    stance: string;
}

export interface IContactInfo {

    websites: string[];
    twitterAccounts: string[];
    facebookAccounts: string[];
    instagramAccounts: string[]; 
}

export interface ICandidate {

    _id: any;

    name: string;
    img: string;
    bannerImg: string;
    iSideLink: string;
    policyLink: string;

    parties: string[];
    experiences: string[];
    themes: string[];
    qualities: string[];

    contactInfo: IContactInfo;

    stances: IStance[];
}

export interface ICandidateDoc extends ICandidate, Document { }

const CandidateSchema: Schema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true  // enforcing unique candidate name
    },
    img: {
        type: String,
        required: true
    },
    bannerImg: {
        type: String,
        required: true
    },
    iSideLink: {
        type: String,
        required: true
    },
    policyLink: {
        type: String,
        required: true
    },
    parties: [{
        type: String,
        required: true
    }],
    experiences: [{
        type: String,
        required: true
    }],
    themes: [{
        type: String,
        required: true
    }],
    qualities: [{
        type: String,
        required: true
    }],
    contactInfo: {
        websites: [{
            type: String,
            required: true
        }],
        twitterAccounts: [{
            type: String,
            required: true
        }],
        facebookAccounts: [{
            type: String,
            required: true
        }],
        instagramAccounts: [{
            type: String,
            required: true
        }]
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
    }]
});

export const Candidates: Model<ICandidateDoc> = mongoose.model("Candidate", CandidateSchema);