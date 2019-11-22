import mongoose, { Model } from "mongoose";

import { config } from "../config/config";
import { Candidates, ICandidate, ICandidateDoc, ICandidateStances, IStance, IStancesObj } from "./models/Candidate";
import { IIssue, IIssueDoc, IQuestionsObj, Issues } from "./models/Issue";
import { ICandidateMatch, IUser, IUserDoc, Users } from "./models/User";


export class LRMDatabase {

    private readonly CandidatesModel: Model<ICandidateDoc>;
    private readonly IssuesModel: Model<IIssueDoc>;
    private readonly UsersModel: Model<IUserDoc>;

    // Static data read from DB into application memory for faster webserving
    private allCandidates: ICandidate[];
    private allIssues: IIssue[];

    // Converted from array to object for O(1) search complexity (performance)
    private readonly allCandidateStances: ICandidateStances[];
    private readonly allQuestionsObj: IQuestionsObj;

    public constructor() {

        this.CandidatesModel = Candidates;
        this.IssuesModel = Issues;
        this.UsersModel = Users;

        this.allCandidates = [];
        this.allIssues = [];

        this.allCandidateStances = [];
        this.allQuestionsObj = {};
    }

    public async connectDatabase(): Promise<string> {

        return new Promise((resolve: Function, reject: Function): void => {

            const options: mongoose.ConnectionOptions = {

                useNewUrlParser: true,
                useUnifiedTopology: true,  // prevents deprecation warning
                useCreateIndex: true       // prevents deprecation warning
            };

            mongoose.connect(config.MONGODB_URI, options)

                .then(async () => {

                    return this.CandidatesModel.find().exec();
                })
                .then(async (candidates: ICandidateDoc[]) => {

                    this.allCandidates = this.convertToICandidates(candidates);

                    for (const candidate of this.allCandidates) {

                        const stancesObj: IStancesObj = {};

                        candidate.stances.forEach((stance: IStance) => stancesObj[stance.key] = stance.stance);

                        const candidateStances: ICandidateStances = {

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
                .then((issues: IIssueDoc[]) => {

                    this.allIssues = this.convertToIIssues(issues);

                    for (const issue of this.allIssues) {

                        this.allQuestionsObj[issue.key] = issue.question;
                    }

                    resolve();
                })
                .catch((err: string) => {

                    reject(err);
                });
        });
    }

    public getAllCandidates(): ICandidate[] | null {

        if (this.allCandidates.length > 0) {

            return this.allCandidates;
        }

        return null;
    }

    public getCandidateById(_id: string): ICandidate | null {

        for (const candidate of this.allCandidates) {

            if (candidate._id.toString() === _id) {

                return candidate;
            }
        }

        return null;
    }

    public getAllIssues(): IIssue[] | null {

        if (this.allIssues.length > 0) {

            return this.allIssues;
        }

        return null;
    }

    public getCandidateMatches(userStancesObj: IStancesObj): ICandidateMatch[] | null {

        this.allCandidateStances.forEach((candidateStances: ICandidateStances) => candidateStances.score = 0);

        Object.entries(userStancesObj).forEach((entry: [string, string]) => {

            for (const candidateStances of this.allCandidateStances) {

                const userKey: string = entry[0];
                const userStance: string = entry[1];

                if (candidateStances.stancesObj[userKey] === userStance) {

                    candidateStances.score++;
                }
            }
        });

        const matches: ICandidateMatch[] = [];

        this.allCandidateStances.forEach((candidateStances: ICandidateStances) => {

            const candidateMatch: ICandidateMatch = {

                name: candidateStances.name,
                img: candidateStances.img,
                headImg: candidateStances.headImg,
                bannerImg: candidateStances.bannerImg,
                percentageMatch: Math.floor((candidateStances.score / Object.keys(userStancesObj).length) * 100)
            };

            matches.push(candidateMatch);
        });

        matches.sort((a: ICandidateMatch, b: ICandidateMatch): number => {

            return a.percentageMatch < b.percentageMatch ? 1 : -1;
        });

        if (matches.length > 0) {

            return matches;
        }

        return null;
    }

    public async createNewUser(newUser: IUser): Promise<IUser> {

        return new Promise((resolve: Function, reject: Function): void => {

            this.UsersModel.create(newUser)

                .then((userDoc: IUserDoc) => {

                    const user: IUser = this.convertToIUser(userDoc);

                    resolve(user);
                })
                .catch((err: string) => {

                    reject(err);
                });
        });
    }

    public async getUserById(_id: string): Promise<IUser | null> {

        return new Promise((resolve: Function, reject: Function): void => {

            this.UsersModel.findOne({ _id }).exec()

                .then((userDoc: IUserDoc | null) => {

                    if (userDoc !== null) {

                        const user: IUser = this.convertToIUser(userDoc);

                        user.stances.forEach((stance: IStance) => {

                            stance.question = this.allQuestionsObj[stance.key];
                        });

                        resolve(user);
                    }
                    else {

                        resolve(null);
                    }
                })
                .catch((err: string) => {

                    reject(err);
                });
        });
    }

    public async getUserByEmail(email: string): Promise<IUser | null> {

        return new Promise((resolve: Function, reject: Function): void => {

            this.UsersModel.findOne({ email }).exec()

                .then((userDoc: IUserDoc | null) => {

                    if (userDoc !== null) {

                        const user: IUser = this.convertToIUser(userDoc);

                        user.stances.forEach((stance: IStance) => {

                            stance.question = this.allQuestionsObj[stance.key];
                        });

                        resolve(user);
                    }
                    else {

                        resolve(null);
                    }
                })
                .catch((err: string) => {

                    reject(err);
                });
        });
    }

    public async updateUserQuizResults(_id: string, userStancesObj: IStancesObj, matches: ICandidateMatch[]): Promise<void> {

        return new Promise((resolve: Function, reject: Function): void => {

            const stances: IStance[] = [];

            Object.entries(userStancesObj).forEach((entry: [string, string]) => {

                const stance: IStance = {

                    key: entry[0],
                    stance: entry[1]
                };

                stances.push(stance);
            });

            const options: object[] = [

                { _id },
                { stances, matches },
                { useFindAndModify: false } // prevents deprecation warning
            ];

            // @ts-ignore  (Typescript doesn't like the spread operator "..." for function arguments)
            this.UsersModel.findOneAndUpdate(...options).exec()

                .then(() => {

                    resolve();
                })
                .catch((err: string) => {

                    reject(err);
                });
        });
    }

    private convertToICandidate(candidate: ICandidateDoc): ICandidate {

        const convertedCandidate: ICandidate = candidate.toObject() as ICandidate;

        delete convertedCandidate.__v;

        return convertedCandidate;
    }

    private convertToICandidates(candidates: ICandidateDoc[]): ICandidate[] {

        const convertedCandidates: ICandidate[] = [];

        for (const candidate of candidates) {

            convertedCandidates.push(this.convertToICandidate(candidate));
        }

        return convertedCandidates;
    }

    private convertToIIssue(issue: IIssueDoc): IIssue {

        const convertedIssue: IIssue = issue.toObject() as IIssue;

        delete convertedIssue._id;
        delete convertedIssue.__v;

        return convertedIssue;
    }

    private convertToIIssues(issues: IIssueDoc[]): IIssue[] {

        const convertedIssues: IIssue[] = [];

        for (const issue of issues) {

            convertedIssues.push(this.convertToIIssue(issue));
        }

        return convertedIssues;
    }

    private convertToIUser(user: IUserDoc): IUser {

        const convertedUser: IUser = user.toObject() as IUser;

        delete convertedUser.password; // Don't send password hash back to user (security)
        delete convertedUser.__v;

        return convertedUser;
    }
}