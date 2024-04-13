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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("reflect-metadata");
require("source-map-support/register");
const grammy_middlewares_1 = require("grammy-middlewares");
const runner_1 = require("@grammyjs/runner");
const attachUser_1 = __importDefault(require("@/middlewares/attachUser"));
const bot_1 = __importDefault(require("@/helpers/bot"));
const configureI18n_1 = __importDefault(require("@/middlewares/configureI18n"));
const language_1 = __importDefault(require("@/handlers/language"));
const i18n_1 = __importDefault(require("@/helpers/i18n"));
const language_2 = __importDefault(require("@/menus/language"));
const startMongo_1 = __importDefault(require("@/helpers/startMongo"));
const intro_1 = require("@/handlers/intro");
const User_1 = require("./models/User");
const scheduler_1 = require("./handlers/scheduler");
const logs_1 = __importDefault(require("./middlewares/logs"));
function runApp() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting app...');
        // Mongo
        yield (0, startMongo_1.default)();
        (0, scheduler_1.setScheduler)();
        console.log('Mongo connected');
        bot_1.default
            // Middlewares
            .use((0, grammy_middlewares_1.sequentialize)())
            .use((0, grammy_middlewares_1.ignoreOld)())
            .use(attachUser_1.default)
            .use(i18n_1.default.middleware())
            .use(configureI18n_1.default)
            .use(logs_1.default)
            // Menus
            .use(language_2.default);
        // Commands
        bot_1.default.command(['help', 'start'], (ctx) => __awaiter(this, void 0, void 0, function* () {
            const funnelStep = yield (0, User_1.getFunnelStep)(ctx.dbuser.id);
            if (funnelStep === User_1.FunnelStep.Greetings) {
                ctx.api.sendMessage(ctx.dbuser.id, (0, intro_1.getGreetingsText)(), { parse_mode: 'HTML' });
            }
            else {
                ctx.api.sendMessage(ctx.dbuser.id, `Если вы хотите изменить информацию о себе, воспользуйтесь командой /reset`, { parse_mode: 'HTML' });
            }
        }));
        bot_1.default.command('reset', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield (0, User_1.resetFunnelStep)(ctx.dbuser.id);
            yield ctx.api.sendMessage(ctx.dbuser.id, (0, intro_1.getGreetingsText)(), { parse_mode: 'HTML' });
            yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
        }));
        bot_1.default.command('language', language_1.default);
        bot_1.default.on('message', (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const funnelStep = yield (0, User_1.getFunnelStep)(ctx.dbuser.id);
            if (funnelStep === User_1.FunnelStep.Greetings) {
                ctx.api.sendMessage(ctx.dbuser.id, (0, intro_1.getGreetingsText)(), { parse_mode: 'HTML' });
                yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
            }
            else if (funnelStep === User_1.FunnelStep.Name) {
                const nameSurname = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
                if (nameSurname) {
                    yield (0, User_1.setName)(ctx.dbuser.id, nameSurname);
                    ctx.api.sendMessage(ctx.dbuser.id, (0, intro_1.getCityText)(yield (0, User_1.getFirstName)(ctx.dbuser.id)), { parse_mode: 'HTML' });
                }
                yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
            }
            else if (funnelStep === User_1.FunnelStep.City) {
                const city = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text;
                if (city) {
                    yield (0, User_1.setCity)(ctx.dbuser.id, city);
                    ctx.api.sendMessage(ctx.dbuser.id, (0, intro_1.getBooksText)(yield (0, User_1.getFirstName)(ctx.dbuser.id)), { parse_mode: 'HTML' });
                    yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
                }
            }
            else if (funnelStep === User_1.FunnelStep.Books) {
                const review = (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.text;
                if (review) {
                    yield (0, User_1.setReview)(ctx.dbuser.id, review);
                    ctx.api.sendMessage(ctx.dbuser.id, (0, intro_1.getRegEndText)(yield (0, User_1.getFirstName)(ctx.dbuser.id)), { parse_mode: 'HTML' });
                }
                yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
            }
            else {
                // do nothing if user is registered
            }
        }));
        // Errors
        bot_1.default.catch(console.error);
        // Start bot
        yield bot_1.default.init();
        (0, runner_1.run)(bot_1.default);
        console.info(`Bot ${bot_1.default.botInfo.username} is up and running`);
    });
}
void runApp();
//# sourceMappingURL=app.js.map