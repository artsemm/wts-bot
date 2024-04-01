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
        ctx.api.sendMessage(ctx.dbuser.id, `Привет! Это Random Writing Bot комьюнити школы текстов <a href="https://t.me/+8nVJic5UKAIwZThi">Мне есть что сказать</a> ⚡️ 

Раз в месяц он мэтчит вас с другим участником или участницей комьюнити, чтобы договориться о знакомстве онлайн или офлайн. 
Вы сможете обсудить любые волнующие писательские вопросы или тему месяца — её также предложит бот.

Для начала давайте познакомимся. Напишите свои имя и фамилию 👀`, {parse_mode: 'HTML'})
        await moveFunnelStep(ctx.dbuser.id)
    } 
    else if (funnelStep === FunnelStep.City) {
        const nameSurname = ctx.message?.text
        if (nameSurname) {
          const nameOnly = nameSurname.trim().split(/\s+/)[0]
          ctx.api.sendMessage(ctx.dbuser.id, `Спасибо, ${nameOnly} 🙂 
  
Чтобы вы с мэтчем сразу узнали друг про друга, расскажите про три книги, которые вы прочитали недавно и которые произвели на вас впечатления. 
Никто не ждет подробной рецензии – просто напишите о книгах в паре предложений. `, {parse_mode: 'HTML'})
          
          
          await moveFunnelStep(ctx.dbuser.id) 
        }

    }
    else if (funnelStep === FunnelStep.Books) {
      const booksInfo = ctx.message?.text
      if (booksInfo) {
        ctx.api.sendMessage(ctx.dbuser.id, `Спасибо, ` + '_username_' + ` Бот взялся за работу. А теперь небольшая инструкция:
        1. Каждый первый понедельник месяца вы будете узнавать свою пару — я пришлю сообщение с ником вашего мэтча и его или её книжную подборку в этот чат. А еще отправлю сюда тему месяца. Напишите своему мэтчу в телеграме, чтобы договориться о встрече или созвоне. 
        2. В конце месяца я спрошу о том, как прошла встреча. Вот и всё! Если будут вопросы – пишите сюда 
        `, {parse_mode: 'HTML'})
      }
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
