"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("../config/config");
const LRMDatabase_1 = require("../db/LRMDatabase");
const apiRoutes_1 = require("./routes/apiRoutes");
class Controller {
    constructor() {
        this.router = express_1.default.Router();
        this.database = new LRMDatabase_1.LRMDatabase();
        this.router.use(this.assignAPIRoutes());
        this.router.use(this.sendClientApp.bind(this));
    }
    async connectDatabase() {
        return this.database.connectDatabase();
    }
    assignAPIRoutes() {
        const apiRouter = express_1.default.Router();
        apiRouter.route(apiRoutes_1.apiRoutes.candidatesRoute)
            .get(this.getAllCandidates.bind(this));
        apiRouter.route(`${apiRoutes_1.apiRoutes.candidatesRoute}/:id`)
            .get(this.getCandidateById.bind(this));
        apiRouter.route(apiRoutes_1.apiRoutes.quizRoute)
            .get(this.getAllIssues.bind(this))
            .post(this.postQuizAnswers.bind(this));
        // apiRouter.route(`${apiRoutes.booksRoute}/:id`)
        //     .delete(this.deleteBook.bind(this));
        // apiRouter.route(apiRoutes.searchRoute)
        //     .get(this.searchGoogleBooks.bind(this));
        return apiRouter;
    }
    sendClientApp(_request, response) {
        response.sendFile(config_1.config.htmlAssetPath);
    }
    getAllCandidates(_request, response) {
        const allCandidates = this.database.getAllCandidates();
        if (allCandidates !== null) {
            response.json(allCandidates);
        }
        else {
            const err = "Error: No candidates found.";
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(422).json(err);
        }
    }
    getCandidateById(request, response) {
        const id = request.params.id;
        const candidate = this.database.getCandidateById(id);
        if (candidate !== null) {
            response.json(candidate);
        }
        else {
            const err = `Error: Candidate not found with _id === ${id}`;
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(422).json(err);
        }
    }
    getAllIssues(_request, response) {
        const allIssues = this.database.getAllIssues();
        if (allIssues !== null) {
            response.json(allIssues);
        }
        else {
            const err = "Error: No issues found.";
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(422).json(err);
        }
    }
    postQuizAnswers(request, response) {
        const userStancesObj = request.body;
        const matches = this.database.getCandidateMatches(userStancesObj);
        if (matches !== null) {
            response.json(matches);
        }
        else {
            const err = "Error: No matches found.";
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(422).json(err);
        }
    }
}
exports.Controller = Controller;
