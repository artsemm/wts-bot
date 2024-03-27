import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/language'
import sendHelp from '@/handlers/help'
import startMongo from '@/helpers/startMongo'
import { handleIntro } from '@/handlers/intro'
import { setTgUser } from './models/User'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    // Menus
    .use(languageMenu)
  // Commands
  bot.command(['help', 'start'], sendHelp)
  bot.command('language', handleLanguage)
  bot.command('intro', handleIntro)
  bot.on('message', async (ctx) => {
    // Check if the message is a reply to the bot
    if (ctx.dbuser.funnelStep = 'greetings') {
        const userName = ctx.message.text;
        // Reply with "Nice to meet you, <name>"
        const userInfo = ctx.message.from
        await setTgUser(ctx.dbuser.id, userInfo)
        await ctx.reply(`Nice to meet you, ${userName}!`);
    } 
});
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
