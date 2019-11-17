"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("../config/config");
const bernieSeed_1 = require("../db/seeds/bernieSeed");
const Candidate_1 = require("../models/Candidate");
const Issue_1 = require("../models/Issue");
const printHeaderFunctions_1 = require("../utility/printHeaderFunctions");
const issuesSeed_1 = require("./seeds/issuesSeed");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // prevents deprecation warning
};
printHeaderFunctions_1.printHeader();
terminal_kit_1.terminal.cyan("  Seeding Database...\n\n");
mongoose_1.default.connect(config_1.config.MONGODB_URI, options)
    .then(async () => {
    terminal_kit_1.terminal.white("  Clearing collections ► ");
    const promises = [];
    promises.push(Issue_1.Issues.deleteMany({}).exec());
    promises.push(Candidate_1.Candidates.deleteMany({}).exec());
    return Promise.all(promises);
})
    .then(async () => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.white("  Inserting Issues ► ");
    return Issue_1.Issues.insertMany(issuesSeed_1.issuesSeed);
})
    .then(async () => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.white("  Inserting Candidate: Bernie Sanders ► ");
    return Candidate_1.Candidates.create(bernieSeed_1.bernieSeed);
})
    .then(() => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.cyan("  Seeding database finished.\n");
    process.exit(0);
})
    .catch((err) => {
    console.log(err);
    process.exit(0);
});
