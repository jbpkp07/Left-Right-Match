import { default as express } from "express";
import session from "express-session";
import { terminal } from "terminal-kit";

import { config } from "./config/config";
import { Controller } from "./controller/Controller";
import { printHeader } from "./utility/printHeaderFunctions";

const controller: Controller = new Controller();

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions: session.SessionOptions = {

    secret: "35036ca3-7153-4b9a-a854-c21ceba18c5c", // random UUID
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));

if (process.env.NODE_ENV === "production") {

    app.use(express.static(config.publicAssetsPath));
}

app.use(controller.router);

printHeader();

controller.connectDatabase()

    .then(() => {

        app.listen(config.port, () => {

            terminal.white("  Webserver listening on port ► ").brightGreen(`${config.port}\n\n`);
        });
    })
    .catch((err: string) => {

        terminal.red(err);
    });