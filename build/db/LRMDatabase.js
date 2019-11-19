"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("../config/config");
// tslint:disable-next-line: ordered-imports
const Candidate_1 = require("./models/Candidate");
// tslint:disable-next-line: ordered-imports
const Issue_1 = require("./models/Issue");
// tslint:disable-next-line: ordered-imports
// import { Users, IUserDoc } from "./models/User";
class LRMDatabase {
    constructor() {
        this.CandidatesModel = Candidate_1.Candidates;
        this.IssuesModel = Issue_1.Issues;
        // this.UsersModel = Users;
        this.allCandidates = [];
        this.allIssues = [];
    }
    async connectDatabase() {
        return new Promise((resolve, reject) => {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true // prevents deprecation warning
            };
            mongoose_1.default.connect(config_1.config.MONGODB_URI, options)
                .then(async () => {
                return this.CandidatesModel.find().exec();
            })
                .then(async (candidates) => {
                this.allCandidates = this.convertToICandidates(candidates);
                return this.IssuesModel.find().exec();
            })
                .then((issues) => {
                this.allIssues = this.convertToIIssues(issues);
                resolve();
            })
                .catch((err) => {
                terminal_kit_1.terminal.red(err);
                reject();
            });
        });
    }
    getAllCandidates() {
        return this.allCandidates;
    }
    getAllIssues() {
        return this.allIssues;
    }
    // prunes the extras that come with a mongoose document, leaving the data only
    convertToICandidate(candidate) {
        const convertedCandidate = candidate.toObject();
        delete convertedCandidate.__v;
        return convertedCandidate;
    }
    convertToICandidates(candidates) {
        const convertedCandidates = [];
        for (const candidate of candidates) {
            convertedCandidates.push(this.convertToICandidate(candidate));
        }
        return convertedCandidates;
    }
    convertToIIssue(issue) {
        const convertedIssue = issue.toObject();
        delete convertedIssue._id;
        delete convertedIssue.__v;
        return convertedIssue;
    }
    convertToIIssues(issues) {
        const convertedIssues = [];
        for (const issue of issues) {
            convertedIssues.push(this.convertToIIssue(issue));
        }
        return convertedIssues;
    }
}
exports.LRMDatabase = LRMDatabase;
