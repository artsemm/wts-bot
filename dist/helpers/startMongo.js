"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const env_1 = __importDefault(require("@/helpers/env"));
function startMongo() {
    return (0, mongoose_1.connect)(env_1.default.MONGO);
}
exports.default = startMongo;
//# sourceMappingURL=startMongo.js.map