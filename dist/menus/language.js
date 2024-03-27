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
const menu_1 = require("@grammyjs/menu");
const process_1 = require("process");
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const path_1 = require("path");
const localeFilePaths = (0, fs_1.readdirSync)((0, path_1.resolve)((0, process_1.cwd)(), 'locales'));
const localeFile = (path) => {
    return (0, js_yaml_1.load)((0, fs_1.readFileSync)((0, path_1.resolve)((0, process_1.cwd)(), 'locales', path), 'utf8'));
};
const setLanguage = (languageCode) => (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.dbuser.language = languageCode;
    yield ctx.dbuser.save();
    ctx.i18n.locale(languageCode);
    return ctx.editMessageText(ctx.i18n.t('language_selected'), {
        parse_mode: 'HTML',
        reply_markup: undefined,
    });
});
const languageMenu = new menu_1.Menu('language');
localeFilePaths.forEach((localeFilePath, index) => {
    const localeCode = localeFilePath.split('.')[0];
    const localeName = localeFile(localeFilePath).name;
    languageMenu.text(localeName, setLanguage(localeCode));
    if (index % 2 != 0) {
        languageMenu.row();
    }
});
exports.default = languageMenu;
//# sourceMappingURL=language.js.map