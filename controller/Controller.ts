import bcrypt from "bcrypt";
import { default as express } from "express";
import { terminal } from "terminal-kit";

import { config } from "../config/config";
import { LRMDatabase } from "../db/LRMDatabase";
import { ICandidate, IStancesObj } from "../db/models/Candidate";
import { IIssue } from "../db/models/Issue";
import { ICandidateMatch, ILoginCreds, ISessionState, ISignupInfo, IUser } from "../db/models/User";
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

        apiRouter.route(`${apiRoutes.userRoute}/:id`)
            .get(this.getUserProfile.bind(this));

        apiRouter.route(apiRoutes.sessionRoutes.startRoute)
            .get(this.startSession.bind(this));

        apiRouter.route(apiRoutes.sessionRoutes.loginRoute)
            .post(this.login.bind(this));

        apiRouter.route(apiRoutes.sessionRoutes.signupRoute)
            .post(this.signup.bind(this));

        apiRouter.route(apiRoutes.sessionRoutes.logoutRoute)
            .get(this.logout.bind(this));

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

            if (request.session !== undefined) {

                const isLoggedIn: boolean = request.session.isLoggedIn;
                const userId: string = request.session.userId;

                if (isLoggedIn && userId !== "") {

                    this.database.updateUserQuizResults(userId, userStancesObj, matches)

                        .then(() => { /* Only handle error below */ })
                        .catch((err: string) => {

                            terminal.red(`${err}\n\n`);
                        });
                }
            }
            else {

                const err: string = "Error: Express sessions not running correctly.";

                terminal.red(`${err}\n\n`);
            }

            response.json(matches);
        }
        else {

            const err: string = "Error: No matches found.";

            terminal.red(`${err}\n\n`);

            response.status(422).json(err);
        }
    }

    private getUserProfile(request: express.Request, response: express.Response): void {

        const id: string = request.params.id;

        this.database.getUserById(id)

            .then((userProfile: IUser | null) => {

                let isLoggedIn: boolean = false;
                let userId: string = "";

                if (request.session !== undefined) {

                    isLoggedIn = request.session.isLoggedIn;
                    userId = request.session.userId;
                }

                if (userProfile !== null && isLoggedIn && userId === id) {

                    response.json(userProfile);
                }
                else {

                    const err: string = "Error: Forbidden access to user profile.";

                    terminal.red(`${err}\n\n`);

                    response.status(403).json(err);
                }
            })
            .catch((err: string) => {

                terminal.red(`${err}\n\n`);

                response.status(500).json(err);
            });
    }

    private startSession(request: express.Request, response: express.Response): void {

        if (request.session !== undefined) {

            const sessionState: ISessionState = {

                isLoggedIn: request.session.isLoggedIn || false,
                userId: request.session.userId || ""
            };

            response.json(sessionState);
        }
        else {

            const err: string = "Error: Express sessions not running correctly.";

            terminal.red(`${err}\n\n`);

            response.status(500).json(err);
        }
    }

    private login(request: express.Request, response: express.Response): void {

        const creds: ILoginCreds = {

            email: request.body.email,
            password: request.body.password
        };

        this.database.getUserByEmail(creds.email)

            .then((userProfile: IUser | null) => {

                if (userProfile !== null) {

                    bcrypt.compare(creds.password, userProfile.password, (_err: Error, same: boolean) => {

                        if (request.session !== undefined) {

                            if (same) {

                                request.session.isLoggedIn = true;
                                request.session.userId = userProfile._id;

                                const sessionState: ISessionState = {

                                    isLoggedIn: request.session.isLoggedIn,
                                    userId: request.session.userId
                                };

                                response.json(sessionState);
                            }
                            else {

                                request.session.isLoggedIn = false;
                                request.session.userId = "";

                                const sessionState: ISessionState = {

                                    isLoggedIn: request.session.isLoggedIn,
                                    userId: request.session.userId
                                };

                                const err: string = "Error: Password does not match user email.";

                                terminal.red(`${err}\n\n`);

                                response.status(401).json(sessionState);
                            }
                        }
                        else {

                            const err: string = "Error: Express sessions not running correctly.";

                            terminal.red(`${err}\n\n`);

                            response.status(500).json(err);
                        }
                    });
                }
                else {

                    const err: string = `Error: No account found with submitted email:  ${creds.email}`;

                    terminal.red(`${err}\n\n`);

                    response.status(422).json(err);
                }
            })
            .catch((err: string) => {

                terminal.red(`${err}\n\n`);

                response.status(500).json(err);
            });
    }

    private signup(request: express.Request, response: express.Response): void {

        const info: ISignupInfo = {

            name: request.body.name,
            email: request.body.email,
            password: request.body.password
        };

        this.database.getUserByEmail(info.email)

            .then((userProfile: IUser | null) => {

                if (userProfile === null) {

                    bcrypt.hash(info.password, bcrypt.genSaltSync(10), (_err: Error, encrypted: string) => {

                        const newUser: IUser = {

                            _id: null,
                            name: info.name,
                            email: info.email,
                            password: encrypted,
                            stances: [],
                            matches: []
                        };

                        this.database.createNewUser(newUser)

                            .then((user: IUser) => {

                                if (request.session !== undefined) {

                                    request.session.isLoggedIn = true;
                                    request.session.userId = user._id;

                                    const sessionState: ISessionState = {

                                        isLoggedIn: request.session.isLoggedIn,
                                        userId: request.session.userId
                                    };

                                    response.json(sessionState);
                                }
                                else {

                                    const err: string = "Error: Express sessions not running correctly.";

                                    terminal.red(`${err}\n\n`);

                                    response.status(500).json(err);
                                }
                            })
                            .catch((err: string) => {

                                terminal.red(`${err}\n\n`);

                                response.status(500).json(err);
                            });
                    });
                }
                else {

                    const err: string = "Error: Email account already exists in database.";

                    terminal.red(`${err}\n\n`);

                    if (request.session !== undefined) {

                        request.session.isLoggedIn = false;
                        request.session.userId = "";

                        const sessionState: ISessionState = {

                            isLoggedIn: request.session.isLoggedIn,
                            userId: request.session.userId
                        };

                        response.status(422).json(sessionState);
                    }
                    else {

                        const error: string = "Error: Express sessions not running correctly.";

                        terminal.red(`${error}\n\n`);

                        response.status(500).json(error);
                    }
                }
            })
            .catch((err: string) => {

                terminal.red(`${err}\n\n`);

                response.status(500).json(err);
            });
    }

    private logout(request: express.Request, response: express.Response): void {

        if (request.session !== undefined) {

            request.session.destroy(() => {

                response.json({ success: true });
            });
        }
        else {

            const err: string = "Error: Client trying to logout but does not already have a session.";

            terminal.red(`${err}\n\n`);

            response.status(422).json(err);
        }
    }
}