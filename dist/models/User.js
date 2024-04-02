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
exports.resetFunnelStep = exports.moveFunnelStep = exports.getFirstName = exports.getFunnelStep = exports.setReview = exports.setCity = exports.setName = exports.setTgUser = exports.findOrCreateUser = exports.User = exports.FunnelStep = void 0;
const typegoose_1 = require("@typegoose/typegoose");
var FunnelStep;
(function (FunnelStep) {
    FunnelStep[FunnelStep["Greetings"] = 1] = "Greetings";
    FunnelStep[FunnelStep["Name"] = 2] = "Name";
    FunnelStep[FunnelStep["City"] = 3] = "City";
    FunnelStep[FunnelStep["Books"] = 4] = "Books";
    FunnelStep[FunnelStep["Done"] = 5] = "Done";
})(FunnelStep = exports.FunnelStep || (exports.FunnelStep = {}));
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
    (0, typegoose_1.prop)({ required: true, default: null }),
    __metadata("design:type", Object)
], User.prototype, "tgUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: FunnelStep.Greetings }),
    __metadata("design:type", Number)
], User.prototype, "funnelStep", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: null }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: null }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: null }),
    __metadata("design:type", String)
], User.prototype, "review", void 0);
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
function setTgUser(id, tgUser) {
    return __awaiter(this, void 0, void 0, function* () {
        return UserModel.updateOne({ id }, { tgUser: tgUser });
    });
}
exports.setTgUser = setTgUser;
function setName(id, name) {
    return UserModel.updateOne({ id }, { name: name });
}
exports.setName = setName;
function setCity(id, city) {
    return UserModel.updateOne({ id }, { city: city });
}
exports.setCity = setCity;
function setReview(id, review) {
    return UserModel.updateOne({ id }, { review: review });
}
exports.setReview = setReview;
function getFunnelStep(id) {
    return UserModel.findOne({ id }).select('funnelStep').exec()
        .then(user => {
        if (user) {
            return user.funnelStep;
        }
        else {
            return null;
        }
    })
        .catch(error => {
        console.error('Error retrieving funnelStep:', error);
        return null;
    });
}
exports.getFunnelStep = getFunnelStep;
function getFirstName(id) {
    return UserModel.findOne({ id }).select('name').exec()
        .then(user => {
        if (user) {
            return user.name.trim().split(/\s+/)[0];
        }
        else {
            return null;
        }
    })
        .catch(error => {
        console.error('Error retrieving first name:', error);
        return null;
    });
}
exports.getFirstName = getFirstName;
function moveFunnelStep(id) {
    return UserModel.findOneAndUpdate({ id }, { $inc: { funnelStep: 1 } }, // Increment the funnelStep value by 1
    { new: true } // Return the updated document after the update operation
    );
}
exports.moveFunnelStep = moveFunnelStep;
function resetFunnelStep(id) {
    return UserModel.updateOne({ id }, { funnelStep: 1 });
}
exports.resetFunnelStep = resetFunnelStep;
//# sourceMappingURL=User.js.map