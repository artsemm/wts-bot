"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendOptions(ctx) {
    var _a;
    return {
        reply_to_message_id: (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.message_id,
        parse_mode: 'HTML',
    };
}
exports.default = sendOptions;
//# sourceMappingURL=sendOptions.js.map