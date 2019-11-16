"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const express_1 = __importDefault(require("express"));
// import mongoose, { Model } from "mongoose";
const mongoose_1 = __importDefault(require("mongoose"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("../config/config");
// import { Books, IBook, IBookDoc } from "../models/book";
const apiRoutes_1 = require("../routes/apiRoutes");
class Controller {
    // private readonly Books: Model<IBookDoc> = Books;
    constructor() {
        this.router = express_1.default.Router();
        this.router.use(this.assignAPIRoutes());
        this.router.use(this.sendClientApp.bind(this));
    }
    async connectDatabase() {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true // prevents deprecation warning
        };
        return mongoose_1.default.connect(config_1.config.MONGODB_URI, options);
    }
    assignAPIRoutes() {
        const apiRouter = express_1.default.Router();
        apiRouter.route(apiRoutes_1.apiRoutes.scrapeRoute)
            .get(this.scrapeQuestions.bind(this));
        // apiRouter.route(`${apiRoutes.booksRoute}/:id`)
        //     .delete(this.deleteBook.bind(this));
        // apiRouter.route(apiRoutes.searchRoute)
        //     .get(this.searchGoogleBooks.bind(this));
        return apiRouter;
    }
    sendClientApp(_request, response) {
        response.sendFile(config_1.config.htmlAssetPath);
    }
    scrapeQuestions(_request, response) {
        // Axios.get("https://www.isidewith.com/elections/2020-presidential-quiz")
        axios_1.default.get("https://www.isidewith.com/candidates/bernie-sanders/policies")
            .then((res) => {
            const $ = cheerio_1.default.load(res.data);
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
            let count = 0;
            $("div.sec_body_group.t_").each((_i, element) => {
                const id = $(element).attr("class").split(" ").pop();
                const question = $(element).find("h5").text();
                let stance = $(element).find("span.stance_body").text().split(" ").shift();
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
            .catch((error) => {
            terminal_kit_1.terminal.red(error);
            response.status(500).send(error);
        });
    }
}
exports.Controller = Controller;
