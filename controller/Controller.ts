import Axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { default as express } from "express";
// import mongoose, { Model } from "mongoose";
// import mongoose from "mongoose";
import { terminal } from "terminal-kit";

import { config } from "../config/config";
import { LRMDatabase } from "../db/LRMDatabase";
// import { Books, IBook, IBookDoc } from "../models/book";
import { apiRoutes } from "./routes/apiRoutes";


export class Controller {

    public router: express.Router = express.Router();

    private readonly database: LRMDatabase = new LRMDatabase();

    public constructor() {

        this.router.use(this.assignAPIRoutes());

        this.router.use(this.sendClientApp.bind(this));
    }

    public async connectDatabase(): Promise<void> {

        // const options: mongoose.ConnectionOptions = {

        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,  // prevents deprecation warning
        //     useCreateIndex: true       // prevents deprecation warning
        // };

        // return mongoose.connect(config.MONGODB_URI, options);

        return this.database.connectDatabase();
    }

    private assignAPIRoutes(): express.Router {

        const apiRouter: express.Router = express.Router();
        
        apiRouter.route(apiRoutes.scrapeRoute)
            .get(this.scrapeQuestions.bind(this));

        // apiRouter.route(`${apiRoutes.booksRoute}/:id`)
        //     .delete(this.deleteBook.bind(this));

        // apiRouter.route(apiRoutes.searchRoute)
        //     .get(this.searchGoogleBooks.bind(this));

        return apiRouter;
    }

    private sendClientApp(_request: express.Request, response: express.Response): void {

        response.sendFile(config.htmlAssetPath);
    }

    private scrapeQuestions(_request: express.Request, response: express.Response): void {

        // Axios.get("https://www.isidewith.com/elections/2020-presidential-quiz")
        Axios.get("https://www.isidewith.com/candidates/bernie-sanders/policies")

            .then((res: AxiosResponse) => {

                const $: CheerioStatic = cheerio.load(res.data);



                // let count: number = 0;

                // $("div.sec.sub3.subIssue").each((_i: number, element: CheerioElement) => {

                //     const id: string = $(element).attr("id");
                //     const question: string = $(element).find("div.sec_header_c > h3").text();
                    
                //     console.log(`id:        ${id}\nquestion:  ${question}`);

                //     const stances: string[] = [];

                //     $(element).find("span.label_text").each((_j: number, innerElement: CheerioElement) => {

                //         const stance: string = $(innerElement).text();

                //         if (stances.length < 2) {
                     
                //             stances.push(stance);
                //         }
                //     });

                //     for (const stance of stances) {

                //         console.log(`stance:    ${stance}`);
                //     }



                //     console.log("\n");


                //     count++;
                // });

                // console.log(count);







                let count: number = 0;

                $("div.sec_body_group.t_").each((_i: number, element: CheerioElement) => {

                    const id: string = $(element).attr("class").split(" ").pop() as string;
                    const question: string = $(element).find("h5").text();
                    let stance: string = $(element).find("span.stance_body").text().split(" ").shift() as string;

                    stance = stance.replace(/[^a-z0-9]/gi, "");

                    console.log(`id:        ${id}\nquestion:  ${question}\nstance:    ${stance}\n`);


                    count++;
                });

                console.log(count);

       


                
                response.sendStatus(200);
            //     const articles: IArticle[] = [];

            //     $(config.ultiWorldDgContainerElement).each((_i: number, element: CheerioElement) => {

            //         const heading: Cheerio = $(element).find(config.ultiWorldDgHeadingElement);
            //         const excerpt: Cheerio = $(element).find(config.ultiWorldDgExcerptElement);

            //         const article: IArticle = {

            //             title: heading.text().trim(),
            //             link: heading.attr("href").trim(),
            //             excerpt: excerpt.text().trim(),
            //             notes: []
            //         };

            //         articles.push(article);
            //     });

            //     return this.dgNewsDatabase.filterForUnsavedArticles(articles);
            // })
            // .then(() => {

            //     response.redirect("/");
            })
            .catch((error: string) => {

                terminal.red(error);
                response.status(500).send(error);
            });
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