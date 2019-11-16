"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
const terminal_kit_1 = require("terminal-kit");
const issueElements = "div.sec_body_group.t_";
const keyAttribute = "class";
const questionElements = "h5";
const stanceElements = "span.stance_body";
const scrapeConfigs = [
    {
        url: "https://www.isidewith.com/candidates/bernie-sanders/policies",
        outputFilePath: "./utility/scraped/bernieStances.json"
    },
    {
        url: "https://www.isidewith.com/candidates/elizabeth-warren/policies",
        outputFilePath: "./utility/scraped/warrenStances.json"
    },
    {
        url: "https://www.isidewith.com/candidates/joe-biden-2/policies",
        outputFilePath: "./utility/scraped/bidenStances.json"
    },
    {
        url: "https://www.isidewith.com/candidates/donald-trump/policies",
        outputFilePath: "./utility/scraped/trumpStances.json"
    }
];
for (const config of scrapeConfigs) {
    scrapeCandidateStances(config.url, config.outputFilePath);
}
function scrapeCandidateStances(url, outputFilePath) {
    axios_1.default.get(url)
        .then((res) => {
        const $ = cheerio_1.default.load(res.data);
        const uniqueKeys = new Set();
        const uniqueQuestions = new Set();
        let stances = [];
        let count = 0;
        $(issueElements).each((_i, element) => {
            const key = $(element).attr(keyAttribute).split(" ").pop().replace(/[^0-9]/gi, "").trim();
            const question = $(element).find(questionElements).text().trim();
            const stance = $(element).find(stanceElements).text().split(" ").shift().replace(/[^a-z0-9/-]/gi, "").trim().toLowerCase();
            const nextStance = {
                key,
                question,
                stance
            };
            if (!uniqueKeys.has(nextStance.key) && !uniqueQuestions.has(nextStance.question) && nextStance.key.length !== 0) {
                uniqueKeys.add(nextStance.key);
                uniqueQuestions.add(nextStance.question);
                stances.push(nextStance);
                terminal_kit_1.terminal
                    .cyan(`key:       ${key}\n`)
                    .yellow(`question:  ${question}\n`)
                    .green(`stance:    ${stance.toString()}\n\n`);
                count++;
            }
        });
        console.log(`total count: ${count}\n`);
        for (const stance of stances) {
            if (stance.stance !== "yes" && stance.stance !== "no") {
                console.log(stance.stance);
            }
        }
        stances = stances.sort((a, b) => {
            return parseInt(a.key) > parseInt(b.key) ? 1 : -1;
        });
        fs_1.default.writeFileSync(outputFilePath, JSON.stringify(stances));
    })
        .catch((err) => {
        console.log(err);
    });
}
