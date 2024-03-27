"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = exports.User = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let User = class User {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true, unique: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: 'ru' }),
    __metadata("design:type", String)
], User.prototype, "language", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
User = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], User);
exports.User = User;
const UserModel = (0, typegoose_1.getModelForClass)(User);
function findOrCreateUser(id) {
    return UserModel.findOneAndUpdate({ id }, {}, {
        upsert: true,
        new: true,
    });
}
exports.findOrCreateUser = findOrCreateUser;
//# sourceMappingURL=User.js.map