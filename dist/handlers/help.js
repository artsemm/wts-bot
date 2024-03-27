"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendOptions_1 = require("@/helpers/sendOptions");
function handleHelp(ctx) {
    return ctx.replyWithLocalization('help', (0, sendOptions_1.default)(ctx));
}
exports.default = handleHelp;
//# sourceMappingURL=help.js.map