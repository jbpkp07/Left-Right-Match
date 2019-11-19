"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
const terminal_kit_1 = require("terminal-kit");
const quizURL = "https://www.isidewith.com/elections/2020-presidential-quiz";
const issueElements = "div.sec.sub3.subIssue";
const keyAttribute = "id";
const questionElements = "div.sec_header_c > h3";
const stanceElements = "span.label_text";
const outputFilePath = "./utility/scraped/quiz.json";
axios_1.default.get(quizURL)
    .then((res) => {
    const $ = cheerio_1.default.load(res.data);
    const uniqueKeys = new Set();
    const uniqueQuestions = new Set();
    let issues = [];
    let count = 0;
    $(issueElements).each((_i, element) => {
        const key = $(element).attr(keyAttribute).trim().replace(/[^0-9]/gi, "");
        const question = $(element).find(questionElements).text().trim();
        const stances = [];
        $(element).find(stanceElements).each((_j, innerElement) => {
            const stance = $(innerElement).text();
            if (stances.length < 2) {
                stances.push(stance.trim().toLowerCase());
            }
        });
        const nextIssue = {
            _id: null,
            key,
            question,
            stances
        };
        if (!uniqueKeys.has(nextIssue.key) && !uniqueQuestions.has(nextIssue.question) && nextIssue.key.length !== 0) {
            uniqueKeys.add(nextIssue.key);
            uniqueQuestions.add(nextIssue.question);
            issues.push(nextIssue);
            terminal_kit_1.terminal
                .cyan(`key:       ${key}\n`)
                .yellow(`question:  ${question}\n`)
                .green(`stances:   [${stances.toString()}]\n\n`);
            count++;
        }
    });
    console.log(`total count: ${count}\n`);
    for (const issue of issues) {
        if (!issue.stances.includes("yes") && !issue.stances.includes("no")) {
            console.log(issue.stances);
        }
    }
    issues = issues.sort((a, b) => {
        return parseInt(a.key) > parseInt(b.key) ? 1 : -1;
    });
    fs_1.default.writeFileSync(outputFilePath, JSON.stringify(issues));
})
    .catch((err) => {
    console.log(err);
});
