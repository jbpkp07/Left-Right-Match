import { default as express } from "express";
import { terminal } from "terminal-kit";

import { config } from "./config/config";
import { Controller } from "./controller/Controller";
import { printHeader } from "./utility/printHeaderFunctions";

const controller: Controller = new Controller();

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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