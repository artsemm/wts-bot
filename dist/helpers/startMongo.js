"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const env_1 = require("@/helpers/env");
function startMongo() {
    return (0, mongoose_1.connect)(env_1.default.MONGO);
}
exports.default = startMongo;
//# sourceMappingURL=startMongo.js.map