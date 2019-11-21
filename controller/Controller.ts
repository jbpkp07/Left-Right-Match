import { default as express } from "express";
import { terminal } from "terminal-kit";

import { config } from "../config/config";
import { LRMDatabase } from "../db/LRMDatabase";
import { ICandidate, IStancesObj } from "../db/models/Candidate";
import { IIssue } from "../db/models/Issue";
import { ICandidateMatch, IUser } from "../db/models/User";
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

                if (userProfile !== null) {

                    response.json(userProfile);
                }
                else {

                    const err: string = "Error: User profile not found.";

                    terminal.red(`${err}\n\n`);

                    response.status(422).json(err);
                }
            })
            .catch((err: string) => {

                terminal.red(`${err}\n\n`);

                response.status(422).json("Error: User profile not found.");
            });
    }

    private startSession(request: express.Request, response: express.Response): void {

        const sessionState = {

            isLoggedIn: request.session.isLoggedIn || false
        }

        response.json();
    }

    private login(request: express.Request, response: express.Response): void {

    }

    private signup(request: express.Request, response: express.Response): void {

    }

    private logout(request: express.Request, response: express.Response): void {

    }
}