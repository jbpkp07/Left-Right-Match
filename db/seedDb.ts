import mongoose from "mongoose";
import { terminal } from "terminal-kit";

import { config } from "../config/config";
import { bernieSeed } from "../db/seeds/bernieSeed";
import { Candidates } from "../models/Candidate";
import { Issues } from "../models/Issue";
import { printHeader } from "../utility/printHeaderFunctions";
import { issuesSeed } from "./seeds/issuesSeed";


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
    .then(() => {
        
        terminal.brightGreen("Done!\n\n");

        terminal.cyan("  Seeding database finished.\n");

        process.exit(0);
    })
    .catch((err: string) => {

        console.log(err);

        process.exit(0);
    });