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
import { getBooksText, getCityText, getGreetingsText, getRegEndText } from '@/handlers/intro'
import { setName, setCity, FunnelStep, moveFunnelStep, getFunnelStep, setReview, getFirstName, resetFunnelStep } from './models/User'

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
  bot.command(['help', 'start'], async (ctx) => {
    const funnelStep = await getFunnelStep(ctx.dbuser.id)
    if (funnelStep === FunnelStep.Greetings) {
        ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
    } else {
      ctx.api.sendMessage(ctx.dbuser.id, `Если вы хотите изменить информацию о себе, воспользуйтесь командой /reset`, {parse_mode: 'HTML'})
    }
  })
  bot.command('reset', async ctx => {
    await resetFunnelStep(ctx.dbuser.id)
    await ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
    await moveFunnelStep(ctx.dbuser.id)
  })
  bot.command('language', handleLanguage)
  bot.on('message', async (ctx) => {
    const funnelStep = await getFunnelStep(ctx.dbuser.id)
    if (funnelStep === FunnelStep.Greetings) {
        ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
        await moveFunnelStep(ctx.dbuser.id)
    } 
    else if (funnelStep === FunnelStep.Name) {
      const nameSurname = ctx.message?.text
        if (nameSurname) {
          await setName(ctx.dbuser.id, nameSurname)
      ctx.api.sendMessage(ctx.dbuser.id, getCityText(await getFirstName(ctx.dbuser.id)), {parse_mode: 'HTML'})
        }
        await moveFunnelStep(ctx.dbuser.id)
    }
    else if (funnelStep === FunnelStep.City) {
        const city = ctx.message?.text
          if (city) {
          await setCity(ctx.dbuser.id, city)
          ctx.api.sendMessage(ctx.dbuser.id, getBooksText(await getFirstName(ctx.dbuser.id)), {parse_mode: 'HTML'})
          
          await moveFunnelStep(ctx.dbuser.id) 
          }
    }
    else if (funnelStep === FunnelStep.Books) {
      const review = ctx.message?.text
      if (review) {
        await setReview(ctx.dbuser.id, review)
        ctx.api.sendMessage(ctx.dbuser.id, getRegEndText(await getFirstName(ctx.dbuser.id)), {parse_mode: 'HTML'})
      }
      await moveFunnelStep(ctx.dbuser.id) 
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

