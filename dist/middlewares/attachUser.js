"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("@/models/User");
function attachUser(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.from) {
            throw new Error('No from field found');
        }
        const user = yield (0, User_1.findOrCreateUser)(ctx.from.id);
        if (!user) {
            throw new Error('User not found');
        }
        ctx.dbuser = user;
        return next();
    });
}
exports.default = attachUser;
//# sourceMappingURL=attachUser.js.map