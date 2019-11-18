"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const terminal_kit_1 = require("terminal-kit");
const config_1 = require("../config/config");
const bernieSeed_1 = require("../db/seeds/bernieSeed");
const bidenSeed_1 = require("../db/seeds/bidenSeed");
const trumpSeed_1 = require("../db/seeds/trumpSeed");
const userSeed_1 = require("../db/seeds/userSeed");
const warrenSeed_1 = require("../db/seeds/warrenSeed");
const Candidate_1 = require("../models/Candidate");
const Issue_1 = require("../models/Issue");
const User_1 = require("../models/User");
const printHeaderFunctions_1 = require("../utility/printHeaderFunctions");
const issuesSeed_1 = require("./seeds/issuesSeed");
function createCandidateMatch(candidateSeed) {
    const candidateStancesObj = {};
    candidateSeed.stances.forEach((stance) => candidateStancesObj[stance.key] = stance.stance);
    let candidateScore = 0;
    for (const userStance of userSeed_1.userSeed.stances) {
        if (candidateStancesObj[userStance.key] === userStance.stance) {
            candidateScore++;
        }
    }
    const candidateMatch = {
        name: candidateSeed.name,
        img: candidateSeed.img,
        percentageMatch: Math.floor((candidateScore / userSeed_1.userSeed.stances.length) * 100)
    };
    return candidateMatch;
}
const matches = [];
matches.push(createCandidateMatch(bernieSeed_1.bernieSeed));
matches.push(createCandidateMatch(warrenSeed_1.warrenSeed));
matches.push(createCandidateMatch(bidenSeed_1.bidenSeed));
matches.push(createCandidateMatch(trumpSeed_1.trumpSeed));
matches.sort((a, b) => {
    return a.percentageMatch < b.percentageMatch ? 1 : -1;
});
userSeed_1.userSeed.matches = matches;
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
    promises.push(User_1.Users.deleteMany({}).exec());
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
    .then(async () => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.white("  Inserting Candidate: Elizabeth Warren ► ");
    return Candidate_1.Candidates.create(warrenSeed_1.warrenSeed);
})
    .then(async () => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.white("  Inserting Candidate: Joe Biden ► ");
    return Candidate_1.Candidates.create(bidenSeed_1.bidenSeed);
})
    .then(async () => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.white("  Inserting Candidate: Donald Trump ► ");
    return Candidate_1.Candidates.create(trumpSeed_1.trumpSeed);
})
    .then(async () => {
    terminal_kit_1.terminal.brightGreen("Done!\n\n");
    terminal_kit_1.terminal.white("  Inserting Test User ► ");
    return User_1.Users.create(userSeed_1.userSeed);
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
