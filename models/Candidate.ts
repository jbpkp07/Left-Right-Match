import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStance {

    key: string;
    question?: string;
    stance: string;
}

export interface ICandidate {

    name: string;
    stances: IStance[];
}

export interface ICandidateDoc extends ICandidate, Document { }

const CandidateSchema: Schema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    stances: [{
        key: {
            type: String,
            required: true,
            unique: true
        },
        // question: {
        //     type: String,
        //     required: true,
        //     unique: true
        // },
        stance: {
            type: String,
            required: true
        }
    }]
});

export const Candidates: Model<ICandidateDoc> = mongoose.model("Candidate", CandidateSchema);