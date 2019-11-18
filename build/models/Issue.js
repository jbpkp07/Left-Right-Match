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
const IssueSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true // validation check to add unique issues by scraped key
    },
    question: {
        type: String,
        required: true
    },
    stances: [{
            type: String,
            required: true
        }]
});
exports.Issues = mongoose_1.default.model("Issue", IssueSchema);
