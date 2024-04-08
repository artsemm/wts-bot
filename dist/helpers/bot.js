"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const Context_1 = __importDefault(require("@/models/Context"));
const env_1 = __importDefault(require("@/helpers/env"));
const bot = new grammy_1.Bot(env_1.default.TOKEN, {
    ContextConstructor: Context_1.default,
});
exports.default = bot;
//# sourceMappingURL=bot.js.map