import { default as express } from "express";
import { terminal } from "terminal-kit";

import { config } from "../config/config";
import { LRMDatabase } from "../db/LRMDatabase";
import { ICandidate, IStancesObj } from "../db/models/Candidate";
import { IIssue } from "../db/models/Issue";
import { ICandidateMatch } from "../db/models/User";
import { apiRoutes } from "./routes/apiRoutes";


export class Controller {

    public router: express.Router = express.Router();

    private readonly database: LRMDatabase = new LRMDatabase();

    public constructor() {

        this.router.use(this.assignAPIRoutes());

        this.router.use(this.sendClientApp.bind(this));
    }

    public async connectDatabase(): Promise<string> {

        return this.database.connectDatabase();
    }

    private assignAPIRoutes(): express.Router {

        const apiRouter: express.Router = express.Router();

        apiRouter.route(apiRoutes.candidatesRoute)
            .get(this.getAllCandidates.bind(this));

        apiRouter.route(`${apiRoutes.candidatesRoute}/:id`)
            .get(this.getCandidateById.bind(this));

        apiRouter.route(apiRoutes.quizRoute)
            .get(this.getAllIssues.bind(this))
            .post(this.postQuizAnswers.bind(this));

        // apiRouter.route(`${apiRoutes.booksRoute}/:id`)
        //     .delete(this.deleteBook.bind(this));

        // apiRouter.route(apiRoutes.searchRoute)
        //     .get(this.searchGoogleBooks.bind(this));

        return apiRouter;
    }

    private sendClientApp(_request: express.Request, response: express.Response): void {

        response.sendFile(config.htmlAssetPath);
    }

    private getAllCandidates(_request: express.Request, response: express.Response): void {

        const allCandidates: ICandidate[] | null = this.database.getAllCandidates();

        if (allCandidates !== null) {

            response.json(allCandidates);
        }
        else {

            const err: string = "Error: No candidates found.";

            terminal.red(`${err}\n\n`);

            response.status(422).json(err);
        }
    }

    private getCandidateById(request: express.Request, response: express.Response): void {

        const id: string = request.params.id;

        const candidate: ICandidate | null = this.database.getCandidateById(id);

        if (candidate !== null) {

            response.json(candidate);
        }
        else {

            const err: string = `Error: Candidate not found with _id === ${id}`;

            terminal.red(`${err}\n\n`);

            response.status(422).json(err);
        }
    }

    private getAllIssues(_request: express.Request, response: express.Response): void {

        const allIssues: IIssue[] | null = this.database.getAllIssues();

        if (allIssues !== null) {

            response.json(allIssues);
        }
        else {

            const err: string = "Error: No issues found.";

            terminal.red(`${err}\n\n`);

            response.status(422).json(err);
        }
    }

    private postQuizAnswers(request: express.Request, response: express.Response): void {

        const userStancesObj: IStancesObj = request.body;

        const matches: ICandidateMatch[] | null = this.database.getCandidateMatches(userStancesObj);

        if (matches !== null) {

            response.json(matches);
        }
        else {

            const err: string = "Error: No matches found.";

            terminal.red(`${err}\n\n`);

            response.status(422).json(err);
        }
    }


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