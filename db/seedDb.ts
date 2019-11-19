import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { terminal } from "terminal-kit";

import { config } from "../config/config";
import { Candidates, ICandidate, IStance } from "../db/models/Candidate";
import { Issues } from "../db/models/Issue";
import { ICandidateMatch, Users } from "../db/models/User";
import { bernieSeed } from "../db/seeds/bernieSeed";
import { bidenSeed } from "../db/seeds/bidenSeed";
import { trumpSeed } from "../db/seeds/trumpSeed";
import { userSeed } from "../db/seeds/userSeed";
import { warrenSeed } from "../db/seeds/warrenSeed";
import { printHeader } from "../utility/printHeaderFunctions";
import { issuesSeed } from "./seeds/issuesSeed";

function createCandidateMatch(candidateSeed: ICandidate): ICandidateMatch {

    const candidateStances: Map<string, string> = new Map<string, string>(); // comparing against map keys allows O(1) search complexity

    candidateSeed.stances.forEach((stance: IStance) => candidateStances.set(stance.key, stance.stance));

    let candidateScore: number = 0;

    for (const userStance of userSeed.stances) {

        if (candidateStances.get(userStance.key) === userStance.stance) { 
            
            candidateScore++; 
        }
    }

    const candidateMatch: ICandidateMatch = {

        name: candidateSeed.name,
        img: candidateSeed.img,
        percentageMatch: Math.floor((candidateScore / userSeed.stances.length) * 100)
    };

    return candidateMatch;
}

const matches: ICandidateMatch[] = [];

matches.push(createCandidateMatch(bernieSeed));
matches.push(createCandidateMatch(warrenSeed));
matches.push(createCandidateMatch(bidenSeed));
matches.push(createCandidateMatch(trumpSeed));

matches.sort((a: ICandidateMatch, b: ICandidateMatch): number => {

    return a.percentageMatch < b.percentageMatch ? 1 : -1;
});

userSeed.matches = matches;

userSeed.password = bcrypt.hashSync(userSeed.password, bcrypt.genSaltSync(10));

const options: mongoose.ConnectionOptions = {

    useNewUrlParser: true,
    useUnifiedTopology: true,  // prevents deprecation warning
    useCreateIndex: true       // prevents deprecation warning
};

printHeader();

terminal.cyan("  Seeding Database...\n\n");

mongoose.connect(config.MONGODB_URI, options)

    .then(async () => {

        terminal.white("  Clearing collections ► ");

        const promises: Promise<any>[] = [];

        promises.push(Issues.deleteMany({}).exec());

        promises.push(Candidates.deleteMany({}).exec());

        promises.push(Users.deleteMany({}).exec());
        
        return Promise.all(promises);
    })
    .then(async () => {

        terminal.brightGreen("Done!\n\n");

        terminal.white("  Inserting Issues ► ");

        return Issues.insertMany(issuesSeed);
    })
    .then(async () => {

        terminal.brightGreen("Done!\n\n");

        terminal.white("  Inserting Candidate: Bernie Sanders ► ");

        return Candidates.create(bernieSeed);
    })
    .then(async () => {

        terminal.brightGreen("Done!\n\n");

        terminal.white("  Inserting Candidate: Elizabeth Warren ► ");

        return Candidates.create(warrenSeed);
    })
    .then(async () => {

        terminal.brightGreen("Done!\n\n");

        terminal.white("  Inserting Candidate: Joe Biden ► ");

        return Candidates.create(bidenSeed);
    })
    .then(async () => {

        terminal.brightGreen("Done!\n\n");

        terminal.white("  Inserting Candidate: Donald Trump ► ");

        return Candidates.create(trumpSeed);
    })
    .then(async () => {

        terminal.brightGreen("Done!\n\n");

        terminal.white("  Inserting Test User ► ");

        return Users.create(userSeed);
    })
    .then(() => {

        terminal.brightGreen("Done!\n\n");

        terminal.cyan("  Seeding database finished.\n");

        process.exit(0);
    })
    .catch((err: string) => {

        console.log(err);

        process.exit(1);
    });