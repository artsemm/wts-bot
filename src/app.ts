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
import startMongo from '@/helpers/startMongo'
import { handleFunnel, getBooksText, getCityText, getGreetingsText, getRegEndText } from '@/handlers/intro'
import { setScheduler } from './handlers/scheduler'
import showLog from './middlewares/logs'
import { handleReset, handleHelp } from './handlers/help'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  setScheduler()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    .use(showLog)
    // Menus
    .use(languageMenu)
  // Commands
  bot.command(['help', 'start'], handleHelp)
  bot.command('reset', handleReset)
  bot.on('message', handleFunnel)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}


void runApp()

