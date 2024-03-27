"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
class Context extends grammy_1.Context {
    constructor() {
        super(...arguments);
        this.replyWithLocalization = (text, other, ...rest) => {
            text = this.i18n.t(text);
            return this.reply(text, other, ...rest);
        };
    }
}
exports.default = Context;
//# sourceMappingURL=Context.js.map