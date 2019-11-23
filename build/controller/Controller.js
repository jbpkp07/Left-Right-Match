"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
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
        apiRouter.route(`${apiRoutes_1.apiRoutes.userRoute}/:id`)
            .get(this.getUserProfile.bind(this));
        apiRouter.route(apiRoutes_1.apiRoutes.sessionRoutes.startRoute)
            .get(this.startSession.bind(this));
        apiRouter.route(apiRoutes_1.apiRoutes.sessionRoutes.loginRoute)
            .post(this.login.bind(this));
        apiRouter.route(apiRoutes_1.apiRoutes.sessionRoutes.signupRoute)
            .post(this.signup.bind(this));
        apiRouter.route(apiRoutes_1.apiRoutes.sessionRoutes.logoutRoute)
            .get(this.logout.bind(this));
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
            if (request.session !== undefined) {
                const isLoggedIn = request.session.isLoggedIn;
                const userId = request.session.userId;
                if (isLoggedIn && userId !== "") {
                    this.database.updateUserQuizResults(userId, userStancesObj, matches)
                        .then(() => { })
                        .catch((err) => {
                        terminal_kit_1.terminal.red(`${err}\n\n`);
                    });
                }
                request.session.matches = matches;
            }
            else {
                const err = "Error: Express sessions not running correctly.";
                terminal_kit_1.terminal.red(`${err}\n\n`);
            }
            response.json(matches);
        }
        else {
            const err = "Error: No matches found.";
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(422).json(err);
        }
    }
    getUserProfile(request, response) {
        const id = request.params.id;
        this.database.getUserById(id)
            .then((userProfile) => {
            let isLoggedIn = false;
            let userId = "";
            if (request.session !== undefined) {
                isLoggedIn = request.session.isLoggedIn;
                userId = request.session.userId;
            }
            if (userProfile !== null && isLoggedIn && userId === id) {
                response.json(userProfile);
            }
            else {
                const err = "Error: Forbidden access to user profile.";
                terminal_kit_1.terminal.red(`${err}\n\n`);
                response.status(403).json(err);
            }
        })
            .catch((err) => {
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(500).json(err);
        });
    }
    startSession(request, response) {
        if (request.session !== undefined) {
            const sessionState = {
                isLoggedIn: request.session.isLoggedIn || false,
                userId: request.session.userId || "",
                matches: request.session.matches || []
            };
            response.json(sessionState);
        }
        else {
            const err = "Error: Express sessions not running correctly.";
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(500).json(err);
        }
    }
    login(request, response) {
        const creds = {
            email: request.body.email,
            password: request.body.password
        };
        this.database.getUserByEmail(creds.email)
            .then((userProfile) => {
            if (userProfile !== null) {
                bcrypt_1.default.compare(creds.password, userProfile.password, (_err, same) => {
                    if (request.session !== undefined) {
                        if (same) {
                            request.session.isLoggedIn = true;
                            request.session.userId = userProfile._id;
                            const sessionState = {
                                isLoggedIn: request.session.isLoggedIn,
                                userId: request.session.userId,
                                matches: request.session.matches || []
                            };
                            response.json(sessionState);
                        }
                        else {
                            request.session.isLoggedIn = false;
                            request.session.userId = "";
                            const sessionState = {
                                isLoggedIn: request.session.isLoggedIn,
                                userId: request.session.userId,
                                matches: request.session.matches || []
                            };
                            const err = "Error: Password does not match user email.";
                            terminal_kit_1.terminal.red(`${err}\n\n`);
                            response.status(401).json(sessionState);
                        }
                    }
                    else {
                        const err = "Error: Express sessions not running correctly.";
                        terminal_kit_1.terminal.red(`${err}\n\n`);
                        response.status(500).json(err);
                    }
                });
            }
            else {
                const err = `Error: No account found with submitted email:  ${creds.email}`;
                terminal_kit_1.terminal.red(`${err}\n\n`);
                response.status(401).json(err);
            }
        })
            .catch((err) => {
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(500).json(err);
        });
    }
    signup(request, response) {
        const info = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
        };
        this.database.getUserByEmail(info.email)
            .then((userProfile) => {
            if (userProfile === null) {
                bcrypt_1.default.hash(info.password, bcrypt_1.default.genSaltSync(10), (_err, encrypted) => {
                    const newUser = {
                        _id: null,
                        name: info.name,
                        email: info.email,
                        password: encrypted,
                        stances: [],
                        matches: []
                    };
                    delete newUser._id;
                    this.database.createNewUser(newUser)
                        .then((user) => {
                        if (request.session !== undefined) {
                            request.session.isLoggedIn = true;
                            request.session.userId = user._id;
                            const sessionState = {
                                isLoggedIn: request.session.isLoggedIn,
                                userId: request.session.userId,
                                matches: request.session.matches || []
                            };
                            response.json(sessionState);
                        }
                        else {
                            const err = "Error: Express sessions not running correctly.";
                            terminal_kit_1.terminal.red(`${err}\n\n`);
                            response.status(500).json(err);
                        }
                    })
                        .catch((err) => {
                        terminal_kit_1.terminal.red(`${err}\n\n`);
                        response.status(500).json(err);
                    });
                });
            }
            else {
                const err = "Error: Email account already exists in database.";
                terminal_kit_1.terminal.red(`${err}\n\n`);
                if (request.session !== undefined) {
                    request.session.isLoggedIn = false;
                    request.session.userId = "";
                    const sessionState = {
                        isLoggedIn: request.session.isLoggedIn,
                        userId: request.session.userId,
                        matches: request.session.matches || []
                    };
                    response.status(422).json(sessionState);
                }
                else {
                    const error = "Error: Express sessions not running correctly.";
                    terminal_kit_1.terminal.red(`${error}\n\n`);
                    response.status(500).json(error);
                }
            }
        })
            .catch((err) => {
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(500).json(err);
        });
    }
    logout(request, response) {
        if (request.session !== undefined) {
            request.session.destroy(() => {
                response.json({ success: true });
            });
        }
        else {
            const err = "Error: Client trying to logout but does not already have a session.";
            terminal_kit_1.terminal.red(`${err}\n\n`);
            response.status(422).json(err);
        }
    }
}
exports.Controller = Controller;
