import mongoose, { Document, Model, Schema } from "mongoose";

export interface IQuestionsObj {

    [key: string]: string;
}

export interface IIssue {
    
    _id: any;
    key: string;
    question: string;
    stances: string[];
    __v?: number; 
}

export interface IIssueDoc extends IIssue, Document { }

const IssueSchema: Schema = new Schema({

    key: {
        type: String,
        required: true,
        unique: true     // validation check to add unique issues by scraped key
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