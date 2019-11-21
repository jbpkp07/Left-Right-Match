"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("./config/config");
const Controller_1 = require("./controller/Controller");
const printHeaderFunctions_1 = require("./utility/printHeaderFunctions");
const controller = new Controller_1.Controller();
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const sessionOptions = {
    secret: "35036ca3-7153-4b9a-a854-c21ceba18c5c",
    resave: false,
    saveUninitialized: true
};
app.use(express_session_1.default(sessionOptions));
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(config_1.config.publicAssetsPath));
}
app.use(controller.router);
printHeaderFunctions_1.printHeader();
controller.connectDatabase()
    .then(() => {
    app.listen(config_1.config.port, () => {
        terminal_kit_1.terminal.white("  Webserver listening on port ► ").brightGreen(`${config_1.config.port}\n\n`);
    });
})
    .catch((err) => {
    terminal_kit_1.terminal.red(err);
});
