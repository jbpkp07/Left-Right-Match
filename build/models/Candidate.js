"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CandidateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true // enforcing unique candidate name
    },
    img: {
        type: String,
        required: true
    },
    bannerImg: {
        type: String,
        required: true
    },
    iSideLink: {
        type: String,
        required: true
    },
    policyLink: {
        type: String,
        required: true
    },
    parties: [{
            type: String,
            required: true
        }],
    experiences: [{
            type: String,
            required: true
        }],
    themes: [{
            type: String,
            required: true
        }],
    qualities: [{
            type: String,
            required: true
        }],
    contactInfo: {
        websites: [{
                type: String,
                required: true
            }],
        twitterAccounts: [{
                type: String,
                required: true
            }],
        facebookAccounts: [{
                type: String,
                required: true
            }],
        instagramAccounts: [{
                type: String,
                required: true
            }]
    },
    stances: [{
            key: {
                type: String,
                required: true
            },
            stance: {
                type: String,
                required: true
            }
        }]
});
exports.Candidates = mongoose_1.default.model("Candidate", CandidateSchema);
