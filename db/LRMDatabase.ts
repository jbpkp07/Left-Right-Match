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


    // Users.generateHash = (password) => {

    //     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    // };

    // Users.isValidPassword = (password, hash) => {

    //     return bcrypt.compareSync(password, hash);
    // };














    // private async isBookInDatabase(book: IBook): Promise<[boolean, IBookDoc]> {

    //     return new Promise((resolve: Function, reject: Function): void => {

    //         this.Books.findOne({ googleId: book.googleId }).exec()

    //             .then((result: IBookDoc | null) => {

    //                 if (result !== null) {

    //                     resolve([true, result]);  // is in database
    //                 }
    //                 else {

    //                     resolve([false, result]); // NOT in database
    //                 }

    //             })
    //             .catch((err: string) => {

    //                 reject(err);
    //             });
    //     });
    // }

    // private getAllSavedBooks(_request: express.Request, response: express.Response): void {

    //     this.Books.find().exec()

    //         .then((bookDocs: IBookDoc[]) => {

    //             const books: IBook[] = this.convertToIBooks(bookDocs);

    //             response.json(books);
    //         })
    //         .catch((err: string) => {

    //             terminal.red(err);

    //             response.status(422).json(err);
    //         });
    // }

    // private saveBook(request: express.Request, response: express.Response): void {

    //     const newBook: IBook = request.body;

    //     // remove these properties before saving to database
    //     delete newBook._id;
    //     delete newBook.isSaved;

    //     this.isBookInDatabase(newBook)

    //         .then(async (isInDatabase: [boolean, IBookDoc]) => {

    //             if (!isInDatabase[0]) {

    //                 return this.Books.create(newBook); // NOT in database (can continue with saving)
    //             }

    //             return Promise.reject("Book already saved.");         // is in database (do not continue saving a duplicate)
    //         })
    //         .then((result: IBookDoc) => {

    //             const savedBook: IBook = this.convertToIBook(result);

    //             response.json(savedBook);
    //         })
    //         .catch((err: string) => {

    //             terminal.red(err);

    //             response.status(422).json(err);
    //         });
    // }

    // private deleteBook(request: express.Request, response: express.Response): void {

    //     const bookId: string = request.params.id;

    //     this.Books.findByIdAndDelete(bookId).exec()

    //         .then(async (result: IBookDoc | null) => {

    //             if (result === null) {

    //                 return Promise.reject("Unable to delete book.");
    //             }

    //             return Promise.resolve(result);
    //         })
    //         .then((deletedBookDoc: IBookDoc) => {

    //             const deletedBook: IBook = this.convertToIBook(deletedBookDoc);

    //             deletedBook.isSaved = false;

    //             response.json(deletedBook);
    //         })
    //         .catch((err: string) => {

    //             terminal.red(err);

    //             response.status(422).json(err);
    //         });
    // }

    // private searchGoogleBooks(request: express.Request, response: express.Response): void {

    //     const googleBooks: IBook[] = [];

    //     const promises: Promise<[boolean, IBookDoc]>[] = [];

    //     const axiosConfig: AxiosRequestConfig = {

    //         params: request.query
    //     };

    //     Axios.get(config.googleAPIURL, axiosConfig)

    //         .then(async (results: AxiosResponse) => {

    //             const { items }: any = results.data;                

    //             for (const item of items) {

    //                 const googleBook: IBook = {

    //                     _id: null,
    //                     googleId: item.id || null,
    //                     authors: item.volumeInfo.authors || [],
    //                     description: item.volumeInfo.description || null,
    //                     image: "No Image",
    //                     link: item.volumeInfo.infoLink || null,
    //                     title: item.volumeInfo.title || null,
    //                     isSaved: false
    //                 };

    //                 if (item.volumeInfo.imageLinks !== undefined) {  // Google Books API sometimes does not the 'imageLinks' property

    //                     googleBook.image = item.volumeInfo.imageLinks.thumbnail || null;  
    //                 }

    //                 if (googleBooks.every((book: IBook) => book.googleId !== googleBook.googleId)) {   // prevents duplicate googleId search results

    //                     googleBooks.push(googleBook);
    //                 }
    //             }

    //             for (const book of googleBooks) {

    //                 const promise: Promise<[boolean, IBookDoc]> = this.isBookInDatabase(book);

    //                 promises.push(promise);
    //             }

    //             return Promise.all(promises);
    //         })
    //         .then((areInDatabase: [boolean, IBookDoc][]) => {

    //             for (let i: number = 0; i < googleBooks.length; i++) {

    //                 const isInDatabase: [boolean, IBookDoc] = areInDatabase[i];

    //                 if (isInDatabase[0]) {

    //                     googleBooks[i]._id = isInDatabase[1]._id;

    //                     googleBooks[i].isSaved = true;
    //                 }
    //             }

    //             response.json(googleBooks);
    //         })
    //         .catch((err: string) => {

    //             terminal.red(err);

    //             response.status(422).json(err);
    //         });
    // }

    // // prunes the extras that come with a mongoose document, leaving the data only
    // private convertToIBook(book: IBookDoc): IBook {

    //     const convertedBook: IBook = {

    //         _id: book._id,
    //         googleId: book.googleId,
    //         authors: book.authors,
    //         description: book.description,
    //         image: book.image,
    //         link: book.link,
    //         title: book.title,
    //         isSaved: true
    //     };

    //     return convertedBook;
    // }

    // private convertToIBooks(books: IBookDoc[]): IBook[] {

    //     const convertedBooks: IBook[] = [];

    //     for (const book of books) {

    //         convertedBooks.push(this.convertToIBook(book));
    //     }

    //     return convertedBooks;
    // }
}