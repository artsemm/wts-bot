"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const Context_1 = require("@/models/Context");
const env_1 = require("@/helpers/env");
const bot = new grammy_1.Bot(env_1.default.TOKEN, {
    ContextConstructor: Context_1.default,
});
exports.default = bot;
//# sourceMappingURL=bot.js.map