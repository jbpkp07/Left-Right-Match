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
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // enforcing unique user emails
    },
    password: {
        type: String,
        required: true
    },
    stances: [{
            _id: false,
            key: {
                type: String,
                required: true
            },
            stance: {
                type: String,
                required: true
            }
        }],
    matches: [{
            _id: false,
            name: {
                type: String,
                required: true
            },
            img: {
                type: String,
                required: true
            },
            headImg: {
                type: String,
                required: true
            },
            bannerImg: {
                type: String,
                required: true
            },
            percentageMatch: {
                type: Number,
                required: true
            }
        }]
});
exports.Users = mongoose_1.default.model("User", UserSchema);
