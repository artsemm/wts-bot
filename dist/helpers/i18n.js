"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@grammyjs/i18n");
const process_1 = require("process");
const path_1 = require("path");
const i18n = new i18n_1.I18n({
    defaultLanguageOnMissing: true,
    directory: (0, path_1.resolve)((0, process_1.cwd)(), 'locales'),
    defaultLanguage: 'en',
});
exports.default = i18n;
//# sourceMappingURL=i18n.js.map