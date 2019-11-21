"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const Candidate_1 = require("./models/Candidate");
const Issue_1 = require("./models/Issue");
const User_1 = require("./models/User");
class LRMDatabase {
    constructor() {
        this.CandidatesModel = Candidate_1.Candidates;
        this.IssuesModel = Issue_1.Issues;
        this.UsersModel = User_1.Users;
        this.allCandidates = [];
        this.allIssues = [];
        this.allCandidateStances = [];
        this.allQuestionsObj = {};
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
                        headImg: candidate.headImg,
                        bannerImg: candidate.bannerImg,
                        stancesObj,
                        score: 0
                    };
                    this.allCandidateStances.push(candidateStances);
                }
                return this.IssuesModel.find().exec();
            })
                .then((issues) => {
                this.allIssues = this.convertToIIssues(issues);
                for (const issue of this.allIssues) {
                    this.allQuestionsObj[issue.key] = issue.question;
                }
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
                headImg: candidateStances.headImg,
                bannerImg: candidateStances.bannerImg,
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
    async getUserById(_id) {
        return new Promise((resolve, reject) => {
            this.UsersModel.findOne({ _id }).exec()
                .then((userDoc) => {
                if (userDoc !== null) {
                    const user = this.convertToIUser(userDoc);
                    user.stances.forEach((stance) => {
                        stance.question = this.allQuestionsObj[stance.key];
                    });
                    resolve(user);
                }
                else {
                    resolve(null);
                }
            })
                .catch((err) => {
                reject(err);
            });
        });
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
    convertToIUser(user) {
        const convertedUser = user.toObject();
        delete convertedUser.password; // Don't send password hash back to user (security)
        delete convertedUser.__v;
        return convertedUser;
    }
}
exports.LRMDatabase = LRMDatabase;
