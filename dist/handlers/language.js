"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const language_1 = __importDefault(require("@/menus/language"));
const sendOptions_1 = __importDefault(require("@/helpers/sendOptions"));
function handleLanguage(ctx) {
    return ctx.replyWithLocalization('language', Object.assign(Object.assign({}, (0, sendOptions_1.default)(ctx)), { reply_markup: language_1.default }));
}
exports.default = handleLanguage;
//# sourceMappingURL=language.js.map