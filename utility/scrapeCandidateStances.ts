import Axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs";
import { terminal } from "terminal-kit";

import { IStance } from "../db/models/Candidate";

const issueElements: string = "div.sec_body_group.t_";
const keyAttribute: string = "class";
const questionElements: string = "h5";
const stanceElements: string = "span.stance_body";

interface IScrapeConfig {

    url: string;
    outputFilePath: string;
}

const scrapeConfigs: IScrapeConfig[] = [

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

function scrapeCandidateStances(url: string, outputFilePath: string): void {

    Axios.get(url)

        .then((res: AxiosResponse) => {

            const $: CheerioStatic = cheerio.load(res.data);

            const uniqueKeys: Set<string> = new Set<string>();

            const uniqueQuestions: Set<string | undefined> = new Set<string | undefined>();

            let stances: IStance[] = [];

            let count: number = 0;

            $(issueElements).each((_i: number, element: CheerioElement) => {

                const key: string = ($(element).attr(keyAttribute).split(" ").pop() as string).replace(/[^0-9]/gi, "").trim();

                const question: string = $(element).find(questionElements).text().trim();

                const stance: string = ($(element).find(stanceElements).text().split(" ").shift() as string).replace(/[^a-z0-9/-]/gi, "").trim().toLowerCase();

                const nextStance: IStance = {

                    key,
                    question,
                    stance
                };

                if (!uniqueKeys.has(nextStance.key) && !uniqueQuestions.has(nextStance.question) && nextStance.key.length !== 0) {

                    uniqueKeys.add(nextStance.key);
                    uniqueQuestions.add(nextStance.question);
                    stances.push(nextStance);

                    terminal
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

            stances = stances.sort((a: IStance, b: IStance): number => {

                return parseInt(a.key) > parseInt(b.key) ? 1 : -1;
            });

            fs.writeFileSync(outputFilePath, JSON.stringify(stances));
        })
        .catch((err: string) => {

            console.log(err);
        });
}


