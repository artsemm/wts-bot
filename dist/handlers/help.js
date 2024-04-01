"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("@/models/User");
function handleHelp(ctx) {
    var _a, _b;
    if ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from) {
        (0, User_1.setTgUser)(ctx.dbuser.id, (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.from);
    }
    return;
}
exports.default = handleHelp;
//# sourceMappingURL=help.js.map