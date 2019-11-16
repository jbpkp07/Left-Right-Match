import mongoose, { Document, Model, Schema } from "mongoose";

export interface IIssue {

    key: string;
    question: string;
    stances: string[];
}

export interface IIssueDoc extends IIssue, Document { }

const IssueSchema: Schema = new Schema({

    key: {
        type: String,
        required: true,
        unique: true     // validation check to add unique Issues by scraped key
    },
    question: {
        type: String,
        required: true
    },
    stances: [{
        type: String,
        required: true
    }]
});

export const Issues: Model<IIssueDoc> = mongoose.model("Issue", IssueSchema);