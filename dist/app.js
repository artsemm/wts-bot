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
require("module-alias/register");
require("reflect-metadata");
require("source-map-support/register");
const grammy_middlewares_1 = require("grammy-middlewares");
const runner_1 = require("@grammyjs/runner");
const attachUser_1 = require("@/middlewares/attachUser");
const bot_1 = require("@/helpers/bot");
const configureI18n_1 = require("@/middlewares/configureI18n");
const language_1 = require("@/handlers/language");
const i18n_1 = require("@/helpers/i18n");
const language_2 = require("@/menus/language");
const help_1 = require("@/handlers/help");
const startMongo_1 = require("@/helpers/startMongo");
const intro_1 = require("@/handlers/intro");
const User_1 = require("./models/User");
const sendOptions_1 = require("@/helpers/sendOptions");
function runApp() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting app...');
        // Mongo
        yield (0, startMongo_1.default)();
        console.log('Mongo connected');
        bot_1.default
            // Middlewares
            .use((0, grammy_middlewares_1.sequentialize)())
            .use((0, grammy_middlewares_1.ignoreOld)())
            .use(attachUser_1.default)
            .use(i18n_1.default.middleware())
            .use(configureI18n_1.default)
            // Menus
            .use(language_2.default);
        // Commands
        bot_1.default.command(['help', 'start'], help_1.default);
        bot_1.default.command('language', language_1.default);
        bot_1.default.command('intro', intro_1.handleIntro);
        bot_1.default.on('message', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const funnelStep = yield (0, User_1.getFunnelStep)(ctx.dbuser.id);
            if (funnelStep === User_1.FunnelStep.Greetings) {
                ctx.replyWithLocalization('greeting', Object.assign(Object.assign({}, (0, sendOptions_1.default)(ctx)), { reply_markup: language_2.default }));
            }
            else if (funnelStep === User_1.FunnelStep.City) {
                const text = ctx.message.text;
                yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
                yield ctx.reply('city ' + text);
            }
            else if (funnelStep === User_1.FunnelStep.Books) {
                const text = ctx.message.text;
                yield (0, User_1.moveFunnelStep)(ctx.dbuser.id);
                yield ctx.reply('books ' + text);
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