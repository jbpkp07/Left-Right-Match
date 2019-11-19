import Axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs";
import { terminal } from "terminal-kit";

import { IIssue } from "../db/models/Issue";

const quizURL: string = "https://www.isidewith.com/elections/2020-presidential-quiz";
const issueElements: string = "div.sec.sub3.subIssue";
const keyAttribute: string = "id";
const questionElements: string = "div.sec_header_c > h3";
const stanceElements: string = "span.label_text";
const outputFilePath: string = "./utility/scraped/quiz.json";


Axios.get(quizURL)

    .then((res: AxiosResponse) => {

        const $: CheerioStatic = cheerio.load(res.data);

        const uniqueKeys: Set<string> = new Set<string>();

        const uniqueQuestions: Set<string> = new Set<string>();

        let issues: IIssue[] = [];

        let count: number = 0;

        $(issueElements).each((_i: number, element: CheerioElement) => {

            const key: string = $(element).attr(keyAttribute).trim().replace(/[^0-9]/gi, "");

            const question: string = $(element).find(questionElements).text().trim();

            const stances: string[] = [];

            $(element).find(stanceElements).each((_j: number, innerElement: CheerioElement) => {

                const stance: string = $(innerElement).text();

                if (stances.length < 2) {

                    stances.push(stance.trim().toLowerCase());
                }
            });

            const nextIssue: IIssue = {

                _id: null,
                key,
                question,
                stances
            };

            if (!uniqueKeys.has(nextIssue.key) && !uniqueQuestions.has(nextIssue.question) && nextIssue.key.length !== 0) {

                uniqueKeys.add(nextIssue.key);
                uniqueQuestions.add(nextIssue.question);
                issues.push(nextIssue);

                terminal
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

        issues = issues.sort((a: IIssue, b: IIssue): number => {

            return parseInt(a.key) > parseInt(b.key) ? 1 : -1;
        });

        fs.writeFileSync(outputFilePath, JSON.stringify(issues));
    })
    .catch((err: string) => {

        console.log(err);
    });