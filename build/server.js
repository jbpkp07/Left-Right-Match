"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("./config/config");
const Controller_1 = require("./controller/Controller");
const printHeaderFunctions_1 = require("./utility/printHeaderFunctions");
const controller = new Controller_1.Controller();
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
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
