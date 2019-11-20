"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const Candidate_1 = require("./models/Candidate");
const Issue_1 = require("./models/Issue");
// import { Users, IUserDoc } from "./models/User";
class LRMDatabase {
    constructor() {
        this.CandidatesModel = Candidate_1.Candidates;
        this.IssuesModel = Issue_1.Issues;
        // this.UsersModel = Users;
        this.allCandidates = [];
        this.allIssues = [];
        this.allCandidateStances = [];
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
                for (const candidate of this.allCandidates) {
                    const stancesObj = {};
                    candidate.stances.forEach((stance) => stancesObj[stance.key] = stance.stance);
                    const candidateStances = {
                        name: candidate.name,
                        img: candidate.img,
                        stancesObj,
                        score: 0
                    };
                    this.allCandidateStances.push(candidateStances);
                }
                return this.IssuesModel.find().exec();
            })
                .then((issues) => {
                this.allIssues = this.convertToIIssues(issues);
                resolve();
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    getAllCandidates() {
        if (this.allCandidates.length > 0) {
            return this.allCandidates;
        }
        return null;
    }
    getCandidateById(_id) {
        for (const candidate of this.allCandidates) {
            if (candidate._id.toString() === _id) {
                return candidate;
            }
        }
        return null;
    }
    getAllIssues() {
        if (this.allIssues.length > 0) {
            return this.allIssues;
        }
        return null;
    }
    getCandidateMatches(userStancesObj) {
        this.allCandidateStances.forEach((candidateStances) => candidateStances.score = 0);
        Object.entries(userStancesObj).forEach((entry) => {
            for (const candidateStances of this.allCandidateStances) {
                const userKey = entry[0];
                const userStance = entry[1];
                if (candidateStances.stancesObj[userKey] === userStance) {
                    candidateStances.score++;
                }
            }
        });
        const matches = [];
        this.allCandidateStances.forEach((candidateStances) => {
            const candidateMatch = {
                name: candidateStances.name,
                img: candidateStances.img,
                percentageMatch: Math.floor((candidateStances.score / Object.keys(userStancesObj).length) * 100)
            };
            matches.push(candidateMatch);
        });
        matches.sort((a, b) => {
            return a.percentageMatch < b.percentageMatch ? 1 : -1;
        });
        if (matches.length > 0) {
            return matches;
        }
        return null;
    }
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
