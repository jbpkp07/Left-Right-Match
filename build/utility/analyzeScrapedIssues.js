"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const terminal_kit_1 = require("terminal-kit");
const pruneQuestions = false;
const isPruned = true;
const quizFilePath = path_1.default.join(__dirname, "../../utility/scraped/quiz.json");
const quizJSON = fs_1.default.readFileSync(quizFilePath, "utf8");
const quiz = JSON.parse(quizJSON);
const bernieFilePath = path_1.default.join(__dirname, "../../utility/scraped/bernieStances.json");
const bernieJSON = fs_1.default.readFileSync(bernieFilePath, "utf8");
const bernieStances = JSON.parse(bernieJSON);
const warrenFilePath = path_1.default.join(__dirname, "../../utility/scraped/warrenStances.json");
const warrenJSON = fs_1.default.readFileSync(warrenFilePath, "utf8");
const warrenStances = JSON.parse(warrenJSON);
const bidenFilePath = path_1.default.join(__dirname, "../../utility/scraped/bidenStances.json");
const bidenJSON = fs_1.default.readFileSync(bidenFilePath, "utf8");
const bidenStances = JSON.parse(bidenJSON);
const trumpFilePath = path_1.default.join(__dirname, "../../utility/scraped/trumpStances.json");
const trumpJSON = fs_1.default.readFileSync(trumpFilePath, "utf8");
const trumpStances = JSON.parse(trumpJSON);
const allCandidateStances = [
    bernieStances,
    warrenStances,
    bidenStances,
    trumpStances
];
console.log("Lengths:");
console.log(quiz.length);
allCandidateStances.forEach((stances) => console.log(stances.length));
console.log("\n");
const uniqueKeys = new Set();
for (const issue of quiz) {
    uniqueKeys.add(issue.key);
}
console.log("Unique Keys Length:");
console.log(uniqueKeys.size);
for (const stances of allCandidateStances) {
    uniqueKeys.clear();
    for (const stance of stances) {
        uniqueKeys.add(stance.key);
    }
    console.log(uniqueKeys.size);
}
console.log("\n");
console.log("Issues with total key count !== 4:\n");
for (const issue of quiz) {
    let count = 0;
    for (const stances of allCandidateStances) {
        function checkIntegrity(stance) {
            return (issue.key === stance.key &&
                (isPruned || issue.question === stance.question) &&
                issue.stances.includes(stance.stance));
        }
        if (stances.some(checkIntegrity)) {
            count++;
        }
    }
    if (count !== 4) {
        console.log(issue.key);
        console.log(count);
    }
}
console.log("Stances that do not match quiz issues:\n");
for (const stances of allCandidateStances) {
    for (const stance of stances) {
        function checkIntegrity(issue) {
            return (issue.key === stance.key &&
                (isPruned || issue.question === stance.question) &&
                issue.stances.includes(stance.stance));
        }
        if (!quiz.some(checkIntegrity)) {
            terminal_kit_1.terminal
                .cyan(`key:       ${stance.key}\n`)
                .yellow(`question:  ${stance.question}\n`)
                .green(`stance:    ${stance.stance.toString()}\n\n`);
        }
    }
}
if (pruneQuestions) {
    for (const stances of allCandidateStances) {
        for (const stance of stances) {
            delete stance.question;
        }
    }
    fs_1.default.writeFileSync(bernieFilePath, JSON.stringify(bernieStances));
    fs_1.default.writeFileSync(warrenFilePath, JSON.stringify(warrenStances));
    fs_1.default.writeFileSync(bidenFilePath, JSON.stringify(bidenStances));
    fs_1.default.writeFileSync(trumpFilePath, JSON.stringify(trumpStances));
}
