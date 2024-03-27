"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function configureI18n(ctx, next) {
    ctx.i18n.locale(ctx.dbuser.language);
    return next();
}
exports.default = configureI18n;
//# sourceMappingURL=configureI18n.js.map