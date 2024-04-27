import Context from '@/models/Context'
import { setName, setCity, FunnelStep, moveFunnelStep, getFunnelStep, setReview, getFirstName, resetFunnelStep, User } from '@/models/User'

export function getGreetingsText() {
  return `Привет! Это Random Writing Bot комьюнити школы текстов <a href="https://t.me/+8nVJic5UKAIwZThi">Мне есть что сказать</a> ⚡️ 

Раз в месяц он мэтчит вас с другим участником или участницей комьюнити, чтобы договориться о знакомстве онлайн или офлайн. 
Вы сможете обсудить любые волнующие писательские вопросы или тему месяца — её также предложит бот.

Для начала давайте познакомимся. Напишите свои имя и фамилию 👀`
}
 
export function getCityText(name: string | null) {
  return `Спасибо, ${name}! А теперь напишите свой город – вдруг у вас получится встретиться вживую`
}

export function getBooksText(name: string | null) {
  return  `Спасибо, ${name} 🙂 

Чтобы вы с мэтчем сразу узнали друг про друга, расскажите про три книги, которые вы прочитали недавно и которые произвели на вас впечатления. 

Никто не ждет подробной рецензии – просто напишите о книгах в паре предложений. `
}

export function getRegEndText(name: string | null) {
  return `Спасибо, ${name} 
Бот взялся за работу. А теперь небольшая инструкция:

1. Каждый первый понедельник месяца вы будете узнавать свою пару — я пришлю сообщение с ником вашего мэтча и его или её книжную подборку в этот чат. А еще отправлю сюда тему месяца. Напишите своему мэтчу в телеграме, чтобы договориться о встрече или созвоне. 

2. В конце месяца я спрошу о том, как прошла встреча. Вот и всё! Если будут вопросы – пишите сюда 
`
}

export async function handleFunnel(ctx: Context){
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
}