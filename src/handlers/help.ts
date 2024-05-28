import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { getFunnelStep, FunnelStep, resetFunnelStep, moveFunnelStep, getAllUserIds } from '@/models/User'
import { getGreetingsText } from './intro'
import { isUserAvailable } from './checkUser'

export async function handleHelp(ctx: Context) {
  const funnelStep = await getFunnelStep(ctx.dbuser.id)
  if (funnelStep === FunnelStep.Greetings) {
      ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
      await moveFunnelStep(ctx.dbuser.id)
  } else {
    ctx.api.sendMessage(ctx.dbuser.id, `Если вы хотите изменить информацию о себе, воспользуйтесь командой /reset`, {parse_mode: 'HTML'})
  }
}

export async function handleReset(ctx: Context) {
  await resetFunnelStep(ctx.dbuser.id)
  await ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
  await moveFunnelStep(ctx.dbuser.id)
}

export async function test(ctx: Context) {
  if(ctx.dbuser.username !== 'seagull') {
      ctx.reply('no access')
      return
  }
  const res = await isUserAvailable(ctx.dbuser.id)
  ctx.reply(String(res))
}

export async function sendMessageToEveryone(ctx: Context) {
  if(ctx.dbuser.role !== 'admin') {
      return
  }
  if (!ctx.message || !ctx.message.text) {
      console.log("Empty context error: sendMessageToEveryone")
      return
  }
  const message = ctx.message.text.substring(5)
  const dbUsers = await getAllUserIds()
  for (let i = 0; i < dbUsers.length; i += 1) {
      const isAvailable = await isUserAvailable(dbUsers[i])
      if ( isAvailable ) {
          ctx.api.sendMessage(dbUsers[i], message)
      }
  }
}