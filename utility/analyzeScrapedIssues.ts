import fs from "fs";
import path from "path";
import { terminal } from "terminal-kit";

import { IStance } from "../db/models/Candidate";
import { IIssue } from "../db/models/Issue";

const pruneQuestions: boolean = false;
const isPruned: boolean = true;

const quizFilePath: string = path.join(__dirname, "../../utility/scraped/quiz.json");
const quizJSON: string = fs.readFileSync(quizFilePath, "utf8");
const quiz: IIssue[] = JSON.parse(quizJSON);

const bernieFilePath: string = path.join(__dirname, "../../utility/scraped/bernieStances.json");
const bernieJSON: string = fs.readFileSync(bernieFilePath, "utf8");
const bernieStances: IStance[] = JSON.parse(bernieJSON);

const warrenFilePath: string = path.join(__dirname, "../../utility/scraped/warrenStances.json");
const warrenJSON: string = fs.readFileSync(warrenFilePath, "utf8");
const warrenStances: IStance[] = JSON.parse(warrenJSON);

const bidenFilePath: string = path.join(__dirname, "../../utility/scraped/bidenStances.json");
const bidenJSON: string = fs.readFileSync(bidenFilePath, "utf8");
const bidenStances: IStance[] = JSON.parse(bidenJSON);

const trumpFilePath: string = path.join(__dirname, "../../utility/scraped/trumpStances.json");
const trumpJSON: string = fs.readFileSync(trumpFilePath, "utf8");
const trumpStances: IStance[] = JSON.parse(trumpJSON);

const allCandidateStances: IStance[][] = [

    bernieStances,
    warrenStances,
    bidenStances,
    trumpStances
];

console.log("Lengths:");
console.log(quiz.length);
allCandidateStances.forEach((stances: IStance[]) => console.log(stances.length));
console.log("\n");

const uniqueKeys: Set<string> = new Set<string>();

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

    let count: number = 0;

    for (const stances of allCandidateStances) {

        function checkIntegrity(stance: IStance): boolean {

            return (
                issue.key === stance.key &&
                (isPruned || issue.question === stance.question) &&
                issue.stances.includes(stance.stance)
            );
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

        function checkIntegrity(issue: IIssue): boolean {

            return (
                issue.key === stance.key &&
                (isPruned || issue.question === stance.question) &&
                issue.stances.includes(stance.stance)
            );
        }

        if (!quiz.some(checkIntegrity)) {

            terminal
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

    fs.writeFileSync(bernieFilePath, JSON.stringify(bernieStances));
    fs.writeFileSync(warrenFilePath, JSON.stringify(warrenStances));
    fs.writeFileSync(bidenFilePath, JSON.stringify(bidenStances));
    fs.writeFileSync(trumpFilePath, JSON.stringify(trumpStances));
}