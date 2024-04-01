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
import { setTgUser, FunnelStep, moveFunnelStep, getFunnelStep } from './models/User'
import sendOptions from '@/helpers/sendOptions'

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
    const funnelStep = await getFunnelStep(ctx.dbuser.id)
    if (funnelStep === FunnelStep.Greetings) {
        ctx.replyWithLocalization('greeting', sendOptions(ctx))
    } 
    else if (funnelStep === FunnelStep.City) {
        const text = ctx.message.text;
        await moveFunnelStep(ctx.dbuser.id)
        await ctx.reply('city ' + text)
    }
    else if (funnelStep === FunnelStep.Books) {
        const text = ctx.message.text;
        await moveFunnelStep(ctx.dbuser.id)
        await ctx.reply('books ' + text)
    }
    else {
      // do nothing if user is registered
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
